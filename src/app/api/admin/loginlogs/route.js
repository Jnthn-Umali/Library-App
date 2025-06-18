import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import LoginLog from '@/models/LoginLog';

export async function GET(){
  await dbConnect();
  try{
    const logs = await LoginLog.find().sort({ createdAt: -1 });
    return NextResponse.json(logs);
  }catch (err){
    console.logs(err);
    return NextResponse.json({ error: 'Failed to fetch login logs' }, { status: 500 });
  }
}
