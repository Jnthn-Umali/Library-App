// src/models/LoginLog.js
import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  loginTime: Date,
  userAgent: String,
  ip: String,
}, { timestamps: true });

export default mongoose.models.LoginLog || mongoose.model('LoginLog', loginLogSchema);
