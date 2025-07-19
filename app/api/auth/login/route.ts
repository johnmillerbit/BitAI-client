import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setTokenCookie, verifyPassword } from '../../../../lib/auth';
import { Admin } from '../../../../lib/types';
import pool from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
    }

    const adminQuery = await pool.query<Admin>(
      'SELECT * FROM admin WHERE username = $1',
      [username]
    );

    if (!adminQuery.rows.length) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const admin = adminQuery.rows[0];

    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ id: admin.id, username: admin.username });

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}