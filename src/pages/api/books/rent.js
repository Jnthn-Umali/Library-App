// src/pages/api/books/rent.js
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body; // book ID should be in request body
    await dbConnect();

    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.copies === 0) {
      return res.status(400).json({ message: 'Book is out of stock' });
    }

    if (book.copies <= 0) {
      return res.status(400).json({ error: 'No copies available' });
    }

    book.copies -= 1;
    await book.save();

    res.status(200).json({ message: 'Book rented successfully' });
  } catch (error) {
    console.error('Renting error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
