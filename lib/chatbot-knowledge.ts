export interface KnowledgeEntry {
  keywords: string[]
  response: string
  priority?: number
  modelId?: 'vyana1' | 'vyana2' | 'vyana3'
}

export const CHATBOT_KNOWLEDGE: KnowledgeEntry[] = [];

export const FALLBACK_RESPONSE = "I'm sorry, I'm specifically trained to help with Vybex AI models (Vyana 1.0, 2.0, and 3.0) and our website services. Could you please tell me what you're trying to build or achieve?"
