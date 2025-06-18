// src.models./User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBanned: { type: Boolean, default: false }, // Added for ban feature
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);