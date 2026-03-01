import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Auto-heal existing user limits
        let hasChanges = false;
        if (user.plan === 'free') {
            if (user.monthlyGenerationLimit !== 20) {
                user.monthlyGenerationLimit = 20;
                hasChanges = true;
            }
            if (user.dailyGenerationLimit !== 20) {
                user.dailyGenerationLimit = 20;
                hasChanges = true;
            }
        } else if (user.plan === 'none') {
            if (user.monthlyGenerationLimit !== 0) {
                user.monthlyGenerationLimit = 0;
                hasChanges = true;
            }
            if (user.dailyGenerationLimit !== 0) {
                user.dailyGenerationLimit = 0;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            await user.save();
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Me error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
