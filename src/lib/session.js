import { getIronSession } from 'iron-session';

export const sessionOptions = {
  cookieName: 'auth_session',
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

export async function getSession(cookieStoreOrReq, res) {
  // ✅ Case 1: App Router API routes (NextRequest)
  if (
    cookieStoreOrReq &&
    typeof cookieStoreOrReq.headers?.get === 'function'
  ) {
    const cookie = cookieStoreOrReq.headers.get('cookie') || '';
    const mockReq = {
      headers: {
        cookie,
      },
    };
    const mockRes = {
      getHeader() {},
      setHeader() {},
    };
    return await getIronSession(mockReq, mockRes, sessionOptions);
  }

  // ✅ Case 2: App Router middleware style (cookieStore)
  if (typeof cookieStoreOrReq.get === 'function') {
    return await getIronSession(cookieStoreOrReq, sessionOptions);
  }

  // ✅ Case 3: Pages Router
  if (res && typeof cookieStoreOrReq === 'object' && 'cookies' in cookieStoreOrReq) {
    return await getIronSession(cookieStoreOrReq, res, sessionOptions);
  }

  throw new Error('Invalid arguments for getSession');
}
