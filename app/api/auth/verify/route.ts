import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 400 });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; username: string };
        console.log('Token verified in Node.js API:', decoded);

        return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
    } catch (error: any) {
        console.error('Token verification error in Node.js API:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 401 });
        } else if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({ valid: false, message: 'Token expired' }, { status: 401 });
        }
        return NextResponse.json({ valid: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
