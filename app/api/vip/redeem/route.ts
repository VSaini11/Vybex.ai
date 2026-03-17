import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthToken, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth check
        const token = getAuthToken(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const decoded: any = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
        }

        // 2. Parse request body
        const { code } = await req.json();
        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }
        const cleanCode = code.trim().toUpperCase();

        // 3. Check Vybe Studio env config
        const apiKey = process.env.VYBE_STUDIO_API_KEY;
        const apiUrl = process.env.VYBE_STUDIO_API_URL;

        if (!apiKey || apiKey === 'YOUR_VYBE_STUDIO_API_KEY_HERE' || !apiUrl || apiUrl.includes('your-vybe-studio-url')) {
            console.error('[VIP Redeem] Vybe Studio API not configured');
            return NextResponse.json(
                { error: 'VIP verification service is not configured yet.' },
                { status: 503 }
            );
        }

        // 4. Verify code with Vybe Studio
        let studioResponse: any;
        try {
            console.log(`[VIP Redeem] Verifying code "${cleanCode}" for user ${decoded.email} at ${apiUrl}`);
            
            const verifyRes = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify({ 
                    code: cleanCode,
                    email: decoded.email // Crucial: coupons are often tied to specific emails
                }),
            });

            const responseText = await verifyRes.text();
            console.log(`[VIP Redeem] Studio Status: ${verifyRes.status} | Response: ${responseText}`);

            try {
                studioResponse = JSON.parse(responseText);
            } catch (pErr) {
                studioResponse = { error: 'Failed to parse Studio response' };
            }

            if (!verifyRes.ok) {
                const errMsg = studioResponse?.error || 'Invalid coupon code';
                return NextResponse.json({ error: errMsg }, { status: 400 });
            }
        } catch (fetchErr: any) {
            console.error('[VIP Redeem] Connection error:', fetchErr.message);
            return NextResponse.json(
                { error: 'Could not connect to verification service. Please try again.' },
                { status: 502 }
            );
        }

        // 5. If Vybe Studio says it's valid, activate VIP on this user
        await connectDB();
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.hasVipPass) {
            return NextResponse.json({ error: 'You already have an active VIP Pass!' }, { status: 409 });
        }

        user.plan = 'vip';
        user.hasVipPass = true;
        user.vipPassRedeemedAt = new Date();
        user.vipCouponCode = cleanCode;
        // Give unlimited-style high limits (actual bypass happens in generate route)
        user.monthlyGenerationLimit = 999999;
        user.dailyGenerationLimit = 999999;
        await user.save();

        return NextResponse.json({
            success: true,
            message: '🎉 VIP Pass activated! You now have unlimited access.',
            user: {
                plan: user.plan,
                hasVipPass: user.hasVipPass,
                vipPassRedeemedAt: user.vipPassRedeemedAt,
            },
        });
    } catch (error: any) {
        console.error('[VIP Redeem] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
