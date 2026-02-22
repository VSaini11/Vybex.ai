import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        console.log('--- Razorpay Webhook Received ---');
        console.log('Signature Header:', signature ? `${signature.slice(0, 10)}...` : 'MISSING');
        console.log('Body Length:', body.length);

        if (!secret || !signature) {
            console.error('CRITICAL: Missing secret or signature in environment/headers');
            return NextResponse.json({ error: 'Missing secret or signature' }, { status: 400 });
        }

        // Use standard Razorpay SDK verification
        let isValid = false;
        try {
            isValid = Razorpay.validateWebhookSignature(body, signature, secret);
        } catch (e) {
            console.error('SDK Validation Error during signature check:', e);
        }

        if (!isValid) {
            console.error('INVALID SIGNATURE. Check RAZORPAY_WEBHOOK_SECRET in .env.local.');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(body);
        console.log('Event Type:', event.event);

        // Process successful payments
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const payment = event.payload.payment?.entity || event.payload.order?.entity;
            if (!payment) {
                console.error('No payment/order entity found in payload');
                return NextResponse.json({ status: 'ignored' });
            }

            const notes = payment.notes || {};
            const email = payment.email;
            const amount = payment.amount;

            // Priority: userId from notes, then email from notes, then payment email
            const userId = notes.userId;
            const noteEmail = notes.userEmail;
            const lookupEmail = noteEmail || email;

            console.log(`Processing Order/Payment: ID=${payment.id}, UserId=${userId || 'N/A'}, Email=${lookupEmail}, Amount=${amount} paise`);

            await connectDB();

            let user = null;
            if (userId) {
                user = await User.findById(userId);
                if (user) console.log(`Found user by ID: ${userId}`);
            }

            if (!user && lookupEmail) {
                // Case-insensitive email lookup
                user = await User.findOne({ email: { $regex: new RegExp(`^${lookupEmail}$`, 'i') } });
                if (user) console.log(`Found user by Email: ${lookupEmail}`);
            }

            if (user) {
                let newPlan = 'free';
                let monthlyLimit = 7;
                let dailyLimit = 3;

                // Map amounts back to plans (Amount is in paise)
                if (amount >= 149900) { // ₹1,499.00
                    newPlan = 'pro_plus';
                    monthlyLimit = 300;
                    dailyLimit = 300;
                } else if (amount >= 69900) { // ₹699.00
                    newPlan = 'pro';
                    monthlyLimit = 100;
                    dailyLimit = 100;
                } else if (amount >= 100) { // ₹1.00
                    newPlan = 'free';
                    monthlyLimit = 7;
                    dailyLimit = 3;
                }

                console.log(`Updating user ${user.email} (ID: ${user._id}) to plan: ${newPlan}, M-Limit: ${monthlyLimit}, D-Limit: ${dailyLimit}`);

                user.plan = newPlan;
                user.monthlyGenerationLimit = monthlyLimit;
                user.dailyGenerationLimit = dailyLimit;
                user.generationsUsed = 0;
                user.dailyGenerationsUsed = 0;
                user.lastResetDate = new Date();
                user.lastDailyResetDate = new Date();
                await user.save();

                console.log(`User ${user.email} upgraded successfully`);
            } else {
                console.warn(`User NOT FOUND for ID: ${userId} or Email: ${lookupEmail}`);
            }
        } else {
            console.log(`Ignoring event type: ${event.event}`);
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('WEBHOOK ERROR:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
