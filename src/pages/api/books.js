//src/pages/api/books/js
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

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const books = await Book.find().sort({ createdAt: -1 });
      return res.status(200).json(books);
    } catch (err) {
      console.error('GET /api/books error:', err);
      return res.status(500).json({ error: 'Failed to load books' });
    }
  }

  if (req.method === 'POST') {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
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

      const title     = getVal('title')   || '';
      const author    = getVal('author')  || '';
      const genreRaw  = getVal('genre')   || '';
      const yearRaw   = getVal('year')    || '0';
      const copiesRaw = getVal('copies')  || '0';

      const genres = genreRaw
        .split(',')
        .map(g => g.trim())
        .filter(Boolean);

      const fileEntries = Object.entries(files);
      let imageUrl = null;
      if (fileEntries.length > 0) {
        const [, fileValue] = fileEntries[0];
        const fileObj = Array.isArray(fileValue) ? fileValue[0] : fileValue;
        const filename = fileObj.newFilename || path.basename(fileObj.filepath || '');
        if (filename) {
          imageUrl = `/uploads/${filename}`;
        }
      }

      try {
        const newBook = new Book({
          title,
          author,
          genre: genres,
          year: Number(yearRaw),
          copies: Number(copiesRaw),
          imageUrl,
        });

        await newBook.save();

        const session = await getSession(req, res);
        const user = session?.user;

        if (user?.userId) {
          await StaffLog.create({
            staffId: user.userId,
            action: 'add_book',
            bookId: newBook._id,
            details: { title: newBook.title },
          });
        }

        return res.status(201).json(newBook);
      } catch (saveErr) {
        console.error('Save book error:', saveErr);
        return res.status(500).json({ error: 'Failed to save book' });
      }
    });

    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
