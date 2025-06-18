//src/models/AdminLogs.js
import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    details: Object,
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.AdminLog || mongoose.model('AdminLog', adminLogSchema);
