// src/app/api/user/rentals/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import { getSession } from '@/lib/session';

export async function GET(request) {
  try {
    await dbConnect();

    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const rentals = await Rent.find({ userId: session.user._id })
      .populate('books.bookId', 'title author')
      .sort({ createdAt: -1 })
      .lean();

    const currentDate = new Date();
    const result = rentals.map((rent) => ({
      _id: rent._id,
      status: rent.status,
      createdAt: rent.createdAt,
      books: rent.books.map((b) => ({
        title: b.bookId?.title || b.title || 'Unknown',
        author: b.bookId?.author || b.author || 'Unknown',
        dueDate: b.dueDate,
        rentedAt: b.rentedAt,
        returned: b.returned ?? false,
        overdue: !(b.returned ?? false) && b.dueDate && new Date(b.dueDate) < currentDate,
      })),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('Error fetching user rentals:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}