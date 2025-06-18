import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request, { params }) {
  await dbConnect();

  const { id } = params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'User is already banned' }, { status: 400 });
    }

    user.isBanned = true;
    await user.save();

    return NextResponse.json({ message: 'User banned successfully', user });
  } catch (error) {
    console.error('Error banning user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
