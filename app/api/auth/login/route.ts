import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setTokenCookie, verifyPassword } from '../../../../lib/auth';
import { Admin } from '../../../../lib/types';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
        }

        if (!process.env.POSTGRES_URL) {
            console.error("POSTGRES_URL is not defined in environment variables.");
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const client = await pool.connect();
        try {
            const adminQuery = await client.query<Admin>(
                'SELECT * FROM admin WHERE username = $1',
                [username]
            );

            if (!adminQuery.rows.length) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            const admin = adminQuery.rows[0];

            const isValid = await verifyPassword(password, admin.password);

            if (!isValid) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            const token = generateToken({ id: admin.id, username: admin.username });

            const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
            setTokenCookie(response, token);

            return response;
        } finally {
            client.release();
        }
    } catch (error: unknown) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
