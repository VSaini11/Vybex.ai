import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret || !signature) {
            return NextResponse.json({ error: 'Missing secret or signature' }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(body);

        // Only process successful payments
        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const email = payment.email;
            const amount = payment.amount;

            await connectDB();
            const user = await User.findOne({ email });

            if (user) {
                let newPlan = 'free';
                let limit = 3;

                // Map amounts back to plans (Amount is in paise)
                if (amount >= 149900) { // ₹1,499.00
                    newPlan = 'pro_plus';
                    limit = 300;
                } else if (amount >= 69900) { // ₹699.00
                    newPlan = 'pro';
                    limit = 100;
                }

                user.plan = newPlan;
                user.monthlyGenerationLimit = limit;
                user.generationsUsed = 0;
                user.lastResetDate = new Date();
                await user.save();

                console.log(`User ${email} upgraded to ${newPlan} via Webhook`);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Razorpay Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
