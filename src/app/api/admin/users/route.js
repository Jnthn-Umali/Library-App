// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import UserInfo from '@/models/UserInfo';

export async function GET() {
  await dbConnect();

  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'userinfos', // MongoDB collection name
          localField: '_id',
          foreignField: 'userId',
          as: 'info'
        }
      },
      {
        $unwind: {
          path: '$info',
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

