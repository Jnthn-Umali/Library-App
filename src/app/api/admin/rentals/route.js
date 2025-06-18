// src/app/api/admin/rentals/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import Book from '@/models/Book'; // ✅ Required for population to work

export async function GET() {
  try {
    await dbConnect();

    const rentals = await Rent.find({})
      .populate('userId', 'email')
      .populate('books.bookId', 'title author')
      .lean();

    const rentalsWithBooks = rentals.map((rent) => ({
      _id: rent._id,
      status: rent.status,
      createdAt: rent.createdAt,
      userId: rent.userId, // contains the email
      books: rent.books.map((b) => ({
        _id: b._id,
        title: b.title || b.bookId?.title || 'Unknown Title',
        author: b.author || b.bookId?.author || 'Unknown Author',
        dueDate: b.dueDate || null, // ✅ Include dueDate
      })),
    }));

    return NextResponse.json(rentalsWithBooks);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
