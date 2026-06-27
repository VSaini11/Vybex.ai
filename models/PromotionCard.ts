import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotionCard extends Document {
    title: string;
    image: string; // Base64 encoded string or URL
    order: number;
    isActive: boolean;
    createdAt: Date;
}

const PromotionCardSchema: Schema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true }, // Store base64 or URL
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// Force model re-registration in development to handle schema changes
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.PromotionCard;
}

export default mongoose.models.PromotionCard || mongoose.model<IPromotionCard>('PromotionCard', PromotionCardSchema);
