// src/app/api/admin/analytics/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';
import Rent from '@/models/Rent';

export async function GET() {
  try {
    await dbConnect();

    // 📦 Total counts
    const totalBooks = await Book.countDocuments();
    const totalRentals = await Rent.countDocuments();
    const pendingRentals = await Rent.countDocuments({ status: 'pending' });
    const confirmedRentals = await Rent.countDocuments({ status: 'confirmed' });
    const returnedRentals = await Rent.countDocuments({ status: 'returned' });

    // 📊 Most Rented Books
    const mostRentedBooks = await Rent.aggregate([
      { $unwind: '$books' },
      {
        $group: {
          _id: '$books.bookId',
          count: { $sum: 1 },
          title: { $first: '$books.title' },
          author: { $first: '$books.author' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 📆 Rentals per Month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // normalize to 1st of month

    const monthlyRentalTrends = await Rent.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const trends = monthlyRentalTrends.map((entry) => {
      const date = new Date(entry._id.year, entry._id.month - 1);
      const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      return { label, count: entry.count };
    });

    return NextResponse.json({
      totalBooks,
      totalRentals,
      pendingRentals,
      confirmedRentals,
      returnedRentals,
      mostRentedBooks,
      monthlyRentalTrends: trends
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
