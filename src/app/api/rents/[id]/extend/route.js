//src/app/api/rents/[id]/extend/route.js
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';

export async function PUT(request, { params }) {
  await dbConnect();

  const { id: rentId } = await params;

  if (!mongoose.isValidObjectId(rentId)) {
    return NextResponse.json({ error: 'Invalid rent ID' }, { status: 400 });
  }

  const { bookId, newDueDate } = await request.json();

  if (!bookId || !newDueDate) {
    return NextResponse.json({ error: 'bookId and newDueDate are required' }, { status: 400 });
  }

  try {
    const rent = await Rent.findById(rentId);
    if (!rent) {
      return NextResponse.json({ error: 'Rent not found' }, { status: 404 });
    }

    console.log('Books in rent:', JSON.stringify(rent.books, null, 2));
    console.log('Searching for bookId:', bookId);

    const bookToUpdate = rent.books.find(book => book.bookId.toString() === bookId);

    if (!bookToUpdate) {
      return NextResponse.json({ error: 'Book not found in this rent' }, { status: 404 });
    }

    bookToUpdate.dueDate = new Date(newDueDate);
    await rent.save();

    return NextResponse.json({ message: 'Due date extended successfully', rent });
  } catch (error) {
    console.error('Error extending due date:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}