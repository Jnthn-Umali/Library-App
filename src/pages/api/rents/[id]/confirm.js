import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import Book from '@/models/Book';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      await dbConnect();
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Rent ID is required' });
      }

      const rent = await Rent.findById(id).populate('books.bookId', 'title').populate('userId', 'name email');
      if (!rent) {
        return res.status(404).json({ error: 'Rent not found' });
      }

      // Validate books array
      if (!rent.books || !Array.isArray(rent.books)) {
        return res.status(400).json({ error: 'Invalid books data' });
      }

      // Decrement book copies
      for (const b of rent.books) {
        if (!b.bookId) {
          return res.status(400).json({ error: 'Invalid book ID in rent' });
        }
        const book = await Book.findByIdAndUpdate(b.bookId, { $inc: { copies: -1 } }, { new: true });
        if (!book) {
          return res.status(404).json({ error: `Book with ID ${b.bookId} not found` });
        }
      }

      // Update rent status and confirmedAt
      const confirmedAt = new Date();
      const updatedRent = await Rent.findByIdAndUpdate(
        id,
        { status: 'confirmed', confirmedAt },
        { new: true, runValidators: true }
      ).populate('books.bookId', 'title').populate('userId', 'name email');

      if (!updatedRent) {
        return res.status(500).json({ error: 'Failed to update rent' });
      }

      // Prepare receipt data
      const receiptData = {
        rentId: updatedRent._id.toString(),
        books: updatedRent.books.map(b => ({
          id: b.bookId._id.toString(),
          title: b.bookId.title,
        })),
        confirmedAt: updatedRent.confirmedAt ? updatedRent.confirmedAt.toISOString() : null,
        user: updatedRent.userId ? { name: updatedRent.userId.name, email: updatedRent.userId.email } : null,
      };

      return res.status(200).json({ message: 'Confirmed', receiptData });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}