import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChatbotKnowledge from '@/models/ChatbotKnowledge'

const FALLBACK_RESPONSE = "I'm sorry, I'm specifically trained to help with Vybex AI models (Vyana 1.0, 2.0, and 3.0) and our website services. Could you please tell me what you're trying to build or achieve?"

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
        }

        const lastMessage = messages[messages.length - 1].content.toLowerCase().trim()
        
        await connectDB()
        
        // Fetch all knowledge entries (small dataset, so this is okay for now)
        // For larger datasets, we would use MongoDB's $in or text search
        const knowledge = await ChatbotKnowledge.find({}).lean()
        
        let bestMatch: any = null
        let maxScore = -1

        for (const entry of knowledge) {
            let entryScore = 0
            let matched = false
            
            for (const kw of (entry.keywords || [])) {
                if (lastMessage.includes(kw.toLowerCase().trim())) {
                    matched = true
                    const priority = entry.priority || 1
                    const scoreBoost = kw.length > 8 ? 3 : kw.length > 4 ? 2 : 1
                    entryScore += scoreBoost * priority
                }
            }
            
            if (matched && entryScore > maxScore) {
                maxScore = entryScore
                bestMatch = entry
            }
        }

        // Fallback to default if no match (entry with no keywords and priority 0)
        if (!bestMatch) {
            bestMatch = knowledge.find(e => (!e.keywords || e.keywords.length === 0) && e.priority === 0)
        }

        return NextResponse.json({ 
            text: bestMatch ? bestMatch.response : FALLBACK_RESPONSE, 
            modelId: bestMatch?.modelId 
        })
    } catch (err: any) {
        console.error('[chatbot API error]', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
