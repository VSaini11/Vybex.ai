import mongoose, { Schema, Document } from 'mongoose';

export type PlanType = 'none' | 'free' | 'pro' | 'pro_plus' | 'vip';


export interface IUser extends Document {
    email: string;
    password?: string;
    plan: PlanType;
    generationsUsed: number;
    dailyGenerationsUsed: number;
    monthlyGenerationLimit: number;
    dailyGenerationLimit: number;
    lastResetDate: Date;
    lastDailyResetDate: Date;
    warnings: number;
    isSuspended: boolean;
    hasVipPass: boolean;
    vipPassRedeemedAt?: Date;
    vipCouponCode?: string;
    createdAt: Date;
}


const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ['none', 'free', 'pro', 'pro_plus', 'vip'], default: 'none' },

    generationsUsed: { type: Number, default: 0 },
    dailyGenerationsUsed: { type: Number, default: 0 },
    monthlyGenerationLimit: { type: Number, default: 0 },
    dailyGenerationLimit: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now },
    lastDailyResetDate: { type: Date, default: Date.now },
    warnings: { type: Number, default: 0 },
    isSuspended: { type: Boolean, default: false },
    hasVipPass: { type: Boolean, default: false },
    vipPassRedeemedAt: { type: Date },
    vipCouponCode: { type: String },
    createdAt: { type: Date, default: Date.now },

});

// Force model re-registration in development if needed
if (mongoose.models.User && !mongoose.models.User.schema.path('plan').enumValues.includes('none')) {
    delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
