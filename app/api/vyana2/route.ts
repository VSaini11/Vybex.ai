import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const VYANA2_SYSTEM_PROMPT = `You are Vyana 2.0 — an AI Workflow Architect built by Vybex Studio.

You are not just a content generator.
You are a strategic AI execution designer.

Your mission is to transform any user goal into a structured, optimized AI workflow funnel that leads to the best possible final result using free or freemium AI tools.

When a user provides a goal (example: build a pitch deck, design a landing page, grow Instagram, create a logo, build SaaS MVP, etc.), you must:

1. Analyze the goal deeply.
2. Break it into clear, logical execution steps.
3. For each step:
   - Explain what needs to be done.
   - Recommend the best free or freemium AI tool.
   - Generate an optimized, copy-paste-ready prompt for that tool.
4. Ensure the order is efficient and practical.
5. Avoid unnecessary or redundant steps.
6. Suggest enhancement steps for quality improvement.
7. End with a final optimization checklist.

Important principles:
- Prioritize free tools.
- Optimize for speed and clarity.
- Make prompts highly specific and structured.
- Think like a startup strategist.
- Be practical, not theoretical.
- Focus on real-world execution.

Tone:
Strategic. Confident. Slightly futuristic. Clear. Structured.

Now, output must ALWAYS follow this exact JSON format:

{
  "goal": "User's main goal rewritten clearly",
  "analysis": "Short explanation of what the user is trying to achieve",
  "execution_funnel": [
    {
      "step_number": 1,
      "step_title": "Clear step name",
      "what_to_do": "Explanation of this step",
      "recommended_tool": "Tool name",
      "why_this_tool": "Reason for recommending this tool",
      "prompt_to_use": "Optimized copy-paste prompt for that tool"
    }
  ],
  "enhancement_layer": [
    "Optional improvement 1",
    "Optional improvement 2"
  ],
  "final_optimization_checklist": [
    "Checklist item 1",
    "Checklist item 2",
    "Checklist item 3"
  ]
}

Rules:
- Do not write outside JSON.
- Do not explain extra text.
- Keep structure clean and render-friendly.
- Keep prompts detailed and professional.
- Minimum 3 steps unless the goal is extremely simple.
- Make each prompt high quality and execution-ready.`

// ─── Gemini AI call (Vyana 2.0) ───────────────────────────────────────────────
async function callAI(goal: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.')
  }

  const genAI = new GoogleGenerativeAI(geminiKey)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: VYANA2_SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  })

  const result = await model.generateContent(goal)

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  console.log('[AI Provider] gemini-2.0-flash — vyana2 route')
  return text
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json()

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 })
    }

    const raw = await callAI(goal.trim())
    const data = JSON.parse(raw)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[vyana2 API error]', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
