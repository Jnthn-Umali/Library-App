// src/lib/getSessionUser.js
import { sessionOptions } from './session';
import { getIronSession } from 'iron-session';

export async function getSessionUser(request) {
  const session = await getIronSession(request, sessionOptions);
  return session.user || null;
}
