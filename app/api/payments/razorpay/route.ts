import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAuthToken, verifyToken } from '@/lib/auth';

const razorpay = new Razorpay({
    key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
    key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
});



export async function POST(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const { plan } = await req.json();

        // Define prices in Paise (INR)
        const prices: any = {
            free: 1, // ₹1.00 -> 100 paise
            pro: 699, // ₹699.00 -> 69900 paise
            pro_plus: 1499, // ₹1499.00 -> 149900 paise
        };

        const amount = prices[plan];
        if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise for INR)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: decoded.userId,
                userEmail: decoded.email,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
