import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'vybex_auth_token';

export function signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function setAuthCookie(res: NextResponse, token: string) {
    const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
    res.headers.set('Set-Cookie', cookie);
}

export function getAuthToken(req: NextRequest) {
    const cookie = req.cookies.get(COOKIE_NAME);
    return cookie?.value || null;
}

export function clearAuthCookie(res: NextResponse) {
    const cookie = serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
    res.headers.set('Set-Cookie', cookie);
}
