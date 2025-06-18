// src/models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: [String],
  year: Number,
  copies: Number,
  imageUrl: String,
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);

