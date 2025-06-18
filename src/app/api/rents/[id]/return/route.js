export const dynamic = 'force-dynamic';

import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import Book from '@/models/Book';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';

export async function PUT(req, context) {
  await dbConnect();

  // 1) await the dynamic param
  const { id: rentId } = await context.params;
  if (!mongoose.isValidObjectId(rentId)) {
    return NextResponse.json({ error: 'Invalid rent ID' }, { status: 400 });
  }

  // 2) parse & validate body
  const { bookId } = await req.json();
  if (!bookId || !mongoose.isValidObjectId(bookId)) {
    return NextResponse.json({ error: 'Missing or invalid bookId' }, { status: 400 });
  }

  // 3) load rent & book
  const rent = await Rent.findById(rentId);
  if (!rent) {
    return NextResponse.json({ error: 'Rent not found' }, { status: 404 });
  }

  const bookEntry = rent.books.find(b => b.bookId.toString() === bookId);
  if (!bookEntry) {
    return NextResponse.json({ error: 'Book not found in this rent' }, { status: 404 });
  }

  // 4) toggle return status
  const newStatus = !bookEntry.returned;
  bookEntry.returned   = newStatus;
  bookEntry.returnedAt = newStatus ? new Date() : null;

  // 5) update inventory
  const bookDoc = await Book.findById(bookId);
  if (!bookDoc) {
    return NextResponse.json({ error: 'Book not found in inventory' }, { status: 404 });
  }
  bookDoc.stock += newStatus ? 1 : -1;
  if (bookDoc.stock < 0) {
    return NextResponse.json({ error: 'Cannot reduce stock below 0' }, { status: 400 });
  }

  // 6) save both
  await Promise.all([bookDoc.save(), rent.save()]);

  // 7) if all returned, bump overall status
  if (rent.books.every(b => b.returned)) {
    rent.status = 'returned';
    await rent.save();
  }

  return NextResponse.json({
    message: newStatus ? 'Book marked as returned' : 'Book marked as not returned',
    status: rent.status,
  }, { status: 200 });
}
