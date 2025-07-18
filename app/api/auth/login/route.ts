import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setTokenCookie, verifyPassword } from '../../../../lib/auth';
import { Admin } from '../../../../lib/types';

const users: Admin[] = [
  {
    id: '1',
    username: 'test',
    password: '$2a$12$HytxPrbVQ/4MhCn5QXg4J.3qUEkAfxI6G3n8IXEhZv18WPjuCWAJq', // Hashed password for 'password123'
  },
];

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
    }

    const user = users.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, username: user.username });

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}