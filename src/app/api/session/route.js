// src/app/api/session/route.js
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';

async function loadSession() {
  const cookieStore = await cookies(); // Await cookies()
  return getIronSession(cookieStore, sessionOptions);
}

export async function GET() {
  try {
    const session = await loadSession();
    if (!session?.user) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }
    return NextResponse.json({ isLoggedIn: true, user: session.user }, { status: 200 });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST() {
  return await GET();
}