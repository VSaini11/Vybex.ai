import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword,
            plan: 'free',
            generationsUsed: 0,
            monthlyGenerationLimit: 3,
            lastResetDate: new Date(),
        });

        const token = signToken({ userId: user._id, email: user.email });

        const response = NextResponse.json({
            message: 'User created successfully',
            user: { id: user._id, email: user.email, plan: user.plan },
        });

        setAuthCookie(response, token);

        return response;
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
