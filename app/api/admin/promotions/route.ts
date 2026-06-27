import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromotionCard from '@/models/PromotionCard';

// Cache the API response at the edge for 60 seconds to make it load instantly
export const revalidate = 60;

export async function GET() {
    try {
        await connectDB();
        const cards = await PromotionCard.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(cards);
    } catch (error) {
        console.error('Error fetching promotion cards:', error);
        return NextResponse.json({ error: 'Failed to fetch promotion cards' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { title, image, order } = await req.json();

        if (!title || !image) {
            return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
        }

        const newCard = await PromotionCard.create({
            title,
            image, // Expecting base64 string
            order: order || 0,
        });

        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
        console.error('Error creating promotion card:', error);
        return NextResponse.json({ error: 'Failed to create promotion card' }, { status: 500 });
    }
}
