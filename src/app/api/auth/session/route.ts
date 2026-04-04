import { NextResponse } from 'next/server';
import { adminAuth } from '@/infrastructure/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
    }

    // Set session expiration (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the cookie in the response
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Session Error Details:', error?.message || error);
    return NextResponse.json({ 
      error: 'Unauthorized', 
      details: error?.message || String(error)
    }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
