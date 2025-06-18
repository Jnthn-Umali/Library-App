import mongoose from 'mongoose';

const RentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      title: String,
      author: String,
      _id: mongoose.Schema.Types.ObjectId,
      rentedAt: {
        type: Date,
        default: Date.now,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      returned: { // New field to track return status
        type: Boolean,
        default: false,
      },
      returnedAt: { // Optional: tracks when the book was returned
        type: Date,
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'returned'],
    default: 'pending',
  },
  confirmedAt: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.models.Rent || mongoose.model('Rent', RentSchema);