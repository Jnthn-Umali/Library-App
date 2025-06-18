// src/app/api/auth/login/route.js
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import UserInfo from '@/models/UserInfo';
import bcrypt from 'bcryptjs';
import LoginLog from '@/models/LoginLog';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const userInfo = await UserInfo.findOne({ userId: user._id });
    if (!userInfo) {
      return NextResponse.json({ message: 'User info not found' }, { status: 404 });
    }

    const cookieStore = await cookies(); // Await cookies()
    const session = await getIronSession(cookieStore, sessionOptions);

    session.user = {
      _id: user._id.toString(),
      email: user.email,
      role: userInfo.role,
    };
    await session.save();

    await LoginLog.create({
      userId: user._id,
      email: user.email,
      logTime: new Date(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json(
      { message: 'Login successful', role: userInfo.role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}