// src/app/api/admin/adminlogs/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AdminLog from '@/models/AdminLog';
import User from '@/models/User'; 

export async function GET() {
  await dbConnect();

  try {
    const logs = await AdminLog.find()
      .populate('adminId', 'email') 
      .sort({ timestamp: -1 });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json({ error: 'Failed to fetch admin logs' }, { status: 500 });
  }
}


