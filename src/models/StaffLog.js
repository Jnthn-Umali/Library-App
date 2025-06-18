// src/models/StaffLog.js
import mongoose from 'mongoose';

const staffLogSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'add_book', 'update_book', 'delete_book'
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: false,
    },
    details: Object, // Can contain title, old values, updated fields, etc.
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.StaffLog || mongoose.model('StaffLog', staffLogSchema);
