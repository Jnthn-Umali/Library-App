// src/pages/api/books/[id].js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';
import StaffLog from '@/models/StaffLog';
import { getSession } from '@/lib/session';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  // ─── PUT: Update Book ─────────────────────
  if (req.method === 'PUT') {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      filename: (_name, ext) => `${Date.now()}${ext}`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Upload failed' });
      }

      const getVal = (key) => {
        const v = fields[key];
        return Array.isArray(v) ? v[0] : v;
      };

      const title = getVal('title') || '';
      const author = getVal('author') || '';
      const genreRaw = getVal('genre') || '';
      const yearRaw = getVal('year') || '0';
      const copiesRaw = getVal('copies') || '0';

      const genres = genreRaw.split(',').map(g => g.trim()).filter(Boolean);

      const fileEntries = Object.entries(files);
      let imageUrl = null;
      if (fileEntries.length > 0) {
        const [, fileValue] = fileEntries[0];
        const fileObj = Array.isArray(fileValue) ? fileValue[0] : fileValue;
        const filename = fileObj.newFilename || path.basename(fileObj.filepath || '');
        if (filename) imageUrl = `/uploads/${filename}`;
      }

      try {
        const updated = {
          title,
          author,
          genre: genres,
          year: Number(yearRaw),
          copies: Number(copiesRaw),
        };
        if (imageUrl) updated.imageUrl = imageUrl;

        const updatedBook = await Book.findByIdAndUpdate(id, updated, { new: true });
        if (!updatedBook) {
          return res.status(404).json({ error: 'Book not found' });
        }

        const session = await getSession(req, res);
        const user = session?.user;

        if (!user?._id) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        await StaffLog.create({
          staffId: user._id, // Use _id, not userId
          action: 'edit_book',
          bookId: updatedBook._id,
          timestamp: new Date(),
        });

        return res.status(200).json(updatedBook);
      } catch (error) {
        console.error('Book update error:', error);
        return res.status(500).json({ error: 'Failed to update book' });
      }
    });

    return;
  }

  // ─── DELETE: Delete Book ────────────────────
  if (req.method === 'DELETE') {
    try {
      // Find the book by ID
      const bookToDelete = await Book.findById(id);
      if (!bookToDelete) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // If imageUrl exists, attempt to delete the file from /public/uploads
      if (bookToDelete.imageUrl) {
        const filePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          path.basename(bookToDelete.imageUrl)
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted image file: ${filePath}`);
        } else {
          console.warn(`Image file not found: ${filePath}`);
        }
      }

      // Delete the book from the database
      await Book.findByIdAndDelete(id);

      // Retrieve the user session
      const session = await getSession(req, res);
      const user = session?.user;

      if (!user || !user._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Log the delete action to StaffLog
      await StaffLog.create({
        staffId: user._id,
        action: 'delete_book',
        bookId: id,
        timestamp: new Date(),
      });

      return res.status(204).end(); // No Content
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({ error: 'Failed to delete book' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}