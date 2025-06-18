// app/api/debug-session/route.js
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession(cookies());
  console.log('🧪 Session contents:', session);
  return NextResponse.json({ session });
}
