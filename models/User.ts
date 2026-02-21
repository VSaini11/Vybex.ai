import mongoose, { Schema, Document } from 'mongoose';

export type PlanType = 'free' | 'pro' | 'pro_plus';

export interface IUser extends Document {
    email: string;
    password?: string;
    plan: PlanType;
    generationsUsed: number;
    monthlyGenerationLimit: number;
    lastResetDate: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ['free', 'pro', 'pro_plus'], default: 'free' },
    generationsUsed: { type: Number, default: 0 },
    monthlyGenerationLimit: { type: Number, default: 3 }, // Free plan default
    lastResetDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
