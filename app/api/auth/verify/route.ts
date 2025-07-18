import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    console.log('Token verified in Node.js API:', decoded);

    return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
  } catch (error) {
    console.error('Token verification error in Node.js API:', error);
    return NextResponse.json({ valid: false, message: 'Invalid or expired token' }, { status: 401 });
  }
}