//src/app/api/rents/route.js
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';           // ← ADD THIS
import Rent from '@/models/Rent';
import Book from '@/models/Book';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies(); // ✅ FIXED
    const session = await getSession(cookieStore);
    if (!session?.user?._id || session?.user?.role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rents = await Rent.find()
      .populate('userId', 'name email')
      .populate('books.bookId', 'title author stock')
      .lean();

    return NextResponse.json(rents || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching rents:', error);
    return NextResponse.json({ error: 'Failed to fetch rents' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const cookieStore = await cookies(); // ✅ FIXED
    const session = await getSession(cookieStore);
    if (!session?.user?._id || session?.user?.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { books } = await req.json();
    if (!books?.length) {
      return NextResponse.json({ error: 'No books submitted' }, { status: 400 });
    }

    const bookIds = books.map(book => book._id);
    const existingBooks = await Book.find({ _id: { $in: bookIds } });
    if (existingBooks.length !== books.length) {
      return NextResponse.json({ error: 'Some books not found' }, { status: 400 });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const rent = new Rent({
      userId: session.user._id,
      books: books.map(book => ({
        bookId: book._id,
        title: book.title,
        author: book.author,
        rentedAt: now,
        dueDate,
      })),
      status: 'pending',
    });

    await rent.save();
    return NextResponse.json({ success: true, rent }, { status: 201 });
  } catch (error) {
    console.error('Error submitting rent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const cookieStore = await cookies(); // ✅ FIXED
    const session = await getSession(cookieStore);
    if (!session?.user?._id || session?.user?.role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rentId } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: 'Invalid rent ID' }, { status: 400 });
    }

    const rent = await Rent.findByIdAndUpdate(
      rentId,
      {
        status: 'returned',
        returnedAt: new Date(),
        'books.$[].returned': true,
        'books.$[].returnedAt': new Date(),
      },
      { new: true }
    );

    if (!rent) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    await Book.updateMany(
      { _id: { $in: rent.books.map(b => b.bookId) } },
      { $inc: { stock: 1 } }
    );

    return NextResponse.json({ message: 'Rental returned', rent }, { status: 200 });
  } catch (error) {
    console.error('Return error:', error);
    return NextResponse.json({ error: 'Error processing return' }, { status: 500 });
  }
}
