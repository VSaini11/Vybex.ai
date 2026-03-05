import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { isQuotaError, VYANA_TIRED_ERROR } from '@/lib/ai-errors'

const VYANA3_SYSTEM_PROMPT = `You are Vyana 3.0 — an AI Multimodal Extraction specialist built by Vybex Studio.

Your mission is to analyze the provided document (PDF, Text) or image and extract precise information based on the user's query, then structure it into a visual-friendly format.

CRITICAL: The user HAS provided a file as part of the input. You MUST analyze this file. If you cannot see the file content, do not simply say it wasn't provided; instead, analyze it to the best of your ability using the visual or textual data present in the multimodal parts.

When a user provides a file and a query, you must output a JSON object with this exact structure:

{
  "summary": "Short 1-2 sentence overview of the core findings",
  "insights": [
    {
      "title": "Short title",
      "description": "Specific detail or fact",
      "icon": "A lucide-react icon name (e.g., Zap, Database, Shield, Cpu, Layers, Target, TrendingUp, Search)"
    }
  ],
  "flow": [
    {
      "step": 1,
      "title": "Phase or step name",
      "description": "What happens here",
      "icon": "Lucide icon name"
    }
  ],
  "graphic_type": "process|hierarchy|overview|checklist",
  "raw_analysis": "Full detailed textual analysis for those who want to read more"
}

Principles:
- If it's a process/workflow, focus on the "flow" array.
- If it's a data overview, focus on "insights".
- Always provide a solid "summary".
- Use professional, strategic tone.
- Output ONLY JSON.`

async function callMultimodalAI(prompt: string, fileData?: { base64: string; mimeType: string }): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
        throw new Error('GEMINI_API_KEY is not configured.')
    }

    const genAI = new GoogleGenerativeAI(geminiKey)

    // Using gemini-2.5-flash as requested by user
    const modelToUse = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: VYANA3_SYSTEM_PROMPT,
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
        },
    })

    const parts: any[] = []

    if (fileData) {
        parts.push({
            inlineData: {
                data: fileData.base64,
                mimeType: fileData.mimeType
            }
        })
    }

    parts.push({ text: prompt })

    const result = await modelToUse.generateContent({ contents: [{ role: 'user', parts }] })
    return result.response.text()
}

export async function POST(req: NextRequest) {
    try {
        const { prompt, file } = await req.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // file is expected to be { base64: string, mimeType: string }
        const response = await callMultimodalAI(prompt, file)

        return NextResponse.json({ response })
    } catch (err: any) {
        console.error('[vyana3 API error]', err)
        if (isQuotaError(err)) {
            return NextResponse.json({ error: VYANA_TIRED_ERROR }, { status: 429 })
        }
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
    }
}
