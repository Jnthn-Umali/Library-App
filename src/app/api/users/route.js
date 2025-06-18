import {NextResponse} from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import User from '@/models/User';

export async function POST(request){
   try {
    await dbConnect();
    const body = await request.json();
    const user = await User.create(body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}