import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; username: string }): string {
  return jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function setTokenCookie(response: NextResponse, token: string): void {
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  });
  response.headers.append('Set-Cookie', cookie);
}