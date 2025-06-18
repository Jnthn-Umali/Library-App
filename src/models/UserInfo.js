// src/models/UserInfo.js
import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'],  // Added 'staff' to allowed roles
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError
export default mongoose.models.UserInfo || mongoose.model('UserInfo', userInfoSchema);
