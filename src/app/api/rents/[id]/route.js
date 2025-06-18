export const dynamic = 'force-dynamic';

import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import Book from '@/models/Book';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import mongoose from 'mongoose';

export async function DELETE(req, context) {
  try {
    await dbConnect();

    // 1) session check
    const cookieStore = await cookies();
    const session     = await getSession(cookieStore);
    if (!session?.user?._id || session.user.role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2) await the dynamic params
    const { id: rentId } = await context.params;  // << await here

    if (!mongoose.Types.ObjectId.isValid(rentId)) {
      return NextResponse.json({ error: 'Invalid rent ID' }, { status: 400 });
    }

    // 3) fetch & delete
    const rent = await Rent.findById(rentId);
    if (!rent) {
      return NextResponse.json({ error: 'Rent not found' }, { status: 404 });
    }

    // 4) restore stock
    await Promise.all(
      rent.books.map(b =>
        !b.returned
          ? Book.findByIdAndUpdate(b.bookId, { $inc: { stock: 1 } })
          : null
      )
    );

    // 5) delete
    await Rent.findByIdAndDelete(rentId);

    return NextResponse.json({ message: 'Rent deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('DELETE /api/rents/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete rent' }, { status: 500 });
  }
}
