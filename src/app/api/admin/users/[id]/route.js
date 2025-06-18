// src/app/api/admin/users/[id]/route.js
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import UserInfo from '@/models/UserInfo';
import AdminLog from '@/models/AdminLog';

export async function PUT(req) {
  try {
    await dbConnect();

    const id = new URL(req.url).pathname.split('/').pop();
    const data = await req.json();

    // Update user
    await User.findByIdAndUpdate(id, {
      name: data.name,
      email: data.email,
    });

    // Update or create user info
    await UserInfo.findOneAndUpdate(
      { userId: id },
      {
        role: data.role,
        age: data.age,
        gender: data.gender,
      },
      { upsert: true, new: true }
    );

    // Get session for admin logging
    const cookieStore = await cookies();
    const session = await getSession(cookieStore);
    const adminId = session?.user?._id; // Use _id, not userId
    const adminEmail = session?.user?.email;

    if (!adminId || !adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log admin action
    await AdminLog.create({
      adminId,
      action: 'UPDATE_USER',
      targetUserId: id,
      details: data,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const id = new URL(req.url).pathname.split('/').pop();

    // Delete user info and user
    await UserInfo.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);

    // Get session for admin logging
    const cookieStore = await cookies();
    const session = await getSession(cookieStore);
    const adminId = session?.user?._id; // Use _id, not userId
    const adminEmail = session?.user?.email;

    if (!adminId || !adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log admin action
    await AdminLog.create({
      adminId,
      action: 'DELETE_USER',
      targetUserId: id,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}