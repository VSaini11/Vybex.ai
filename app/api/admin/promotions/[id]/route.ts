import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromotionCard from '@/models/PromotionCard';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
        }

        const deletedCard = await PromotionCard.findByIdAndDelete(id);

        if (!deletedCard) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Card deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting promotion card:', error);
        return NextResponse.json({ error: 'Failed to delete promotion card' }, { status: 500 });
    }
}
