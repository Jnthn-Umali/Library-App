// src/app/api/auth/logout/route.js
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session'; // Use getSession instead of getIronSession
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies(); // Explicitly await cookies()
    const session = await getSession(cookieStore); // Use getSession
    await session.destroy();
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Failed to log out' }, { status: 500 });
  }
}