import mongoose, { Schema, Document } from 'mongoose';

export interface IChatbotKnowledge extends Document {
    keywords: string[];
    response: string;
    priority: number;
    modelId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ChatbotKnowledgeSchema: Schema = new Schema({
    keywords: { type: [String], default: [] },
    response: { type: String, required: true },
    priority: { type: Number, default: 0 },
    modelId: { type: String },
}, {
    timestamps: true
});

// Create a text index on keywords for better searching if needed, 
// though we currently use exact/includes matching logic.
ChatbotKnowledgeSchema.index({ keywords: 1 });

export default mongoose.models.ChatbotKnowledge || mongoose.model<IChatbotKnowledge>('ChatbotKnowledge', ChatbotKnowledgeSchema);
