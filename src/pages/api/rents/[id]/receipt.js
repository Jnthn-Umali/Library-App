import dbConnect from '@/lib/dbConnect';
import Rent from '@/models/Rent';
import Book from '@/models/Book';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default async function handler(req, res) {
  if (req.method === 'GET') {
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

      if (rent.status !== 'confirmed') {
        return res.status(400).json({ error: 'Rent is not confirmed' });
      }

      // Validate confirmedAt
      const confirmedAt = rent.confirmedAt ? new Date(rent.confirmedAt) : null;
      if (!confirmedAt || isNaN(confirmedAt.getTime())) {
        return res.status(400).json({
          error: 'Invalid confirmation date',
          confirmedAt: rent.confirmedAt,
        });
      }

      // Prepare text content
      const booksList = rent.books
        .map(b => `Book ID: ${b.bookId._id.toString()}\nTitle: ${b.bookId.title}`)
        .join('\n\n');
      const textContent = `
Rental Receipt
Library Management System
Date: ${new Date().toLocaleDateString()}

Rental Details:
---------------
Rental ID: ${rent._id.toString()}
Confirmation Date: ${confirmedAt.toISOString().split('T')[0]}
${rent.userId ? `User: ${rent.userId.name}\nEmail: ${rent.userId.email}` : ''}

Rented Books:
-------------
${booksList}

---------------
Thank you for using our library services!
`;

      // Write text to a temporary file
      const tempDir = os.tmpdir();
      const txtFileName = `receipt-${id}.txt`;
      const txtFilePath = path.join(tempDir, txtFileName).replace(/\\/g, '/');
      fs.writeFileSync(txtFilePath, textContent);

      // Read the generated text file
      if (!fs.existsSync(txtFilePath)) {
        return res.status(500).json({ error: 'Text file was not generated' });
      }
      const txtBuffer = fs.readFileSync(txtFilePath);

      // Clean up
      fs.unlinkSync(txtFilePath);

      // Send text response
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.txt`);
      return res.status(200).send(txtBuffer);
    } catch (error) {
      console.error('Receipt API Error:', error);
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}