// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import UserInfo from '@/models/UserInfo';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, age, gender, role } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create user info (linked by userId)
    await UserInfo.create({
      userId: user._id,
      age,
      gender,
      role,
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error registering user' },
      { status: 500 }
    );
  }
}
