import dbConnect from '@/lib/dbConnect';
import StaffLog from '@/models/StaffLog';
import User from '@/models/User';

export async function GET() {
  await dbConnect();

  try {
    const logs = await StaffLog.find()
      .sort({ timestamp: -1 })
      .populate({ path: 'staffId', select: 'email' }); // ✅ populate email from User

    return Response.json(logs);
  } catch (error) {
    console.error('Error fetching staff logs:', error);
    return Response.json({ error: 'Failed to fetch staff logs' }, { status: 500 });
  }
}
