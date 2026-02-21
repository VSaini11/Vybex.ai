import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthToken, verifyToken } from '@/lib/auth'

// Basic in-memory rate limit: 5 requests per minute per user
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function checkRateLimit(userId: string) {
  const now = Date.now()
  const limit = 5
  const windowMs = 60 * 1000 // 1 minute

  const userLimit = rateLimitMap.get(userId) || { count: 0, lastReset: now }

  if (now - userLimit.lastReset > windowMs) {
    userLimit.count = 0
    userLimit.lastReset = now
  }

  if (userLimit.count >= limit) {
    return false
  }

  userLimit.count++
  rateLimitMap.set(userId, userLimit)
  return true
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check Authentication
    const token = getAuthToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    // 2. Rate Limiting
    if (!checkRateLimit(decoded.userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded (5 requests per min)' }, { status: 429 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Plan Logic & Usage Limits
    const now = new Date()
    const lastReset = new Date(user.lastResetDate)

    let shouldReset = false
    if (user.plan === 'free') {
      // Daily reset for Free plan
      shouldReset = lastReset.toDateString() !== now.toDateString()
    } else {
      // Monthly reset for Pro/Pro Plus
      shouldReset = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()
    }

    if (shouldReset) {
      user.generationsUsed = 0
      user.lastResetDate = now
    }

    // Define limits
    const limits = {
      free: { generations: 3, tokens: 1800 },
      pro: { generations: 100, tokens: 2500 },
      pro_plus: { generations: 300, tokens: 3500 },
    }

    const userLimit = limits[user.plan as keyof typeof limits] || limits.free

    if (user.generationsUsed >= userLimit.generations) {
      return NextResponse.json({ error: 'Monthly/Daily generation limit exceeded' }, { status: 403 })
    }

    // 4. OpenAI Call
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 }
      )
    }

    const client = new OpenAI({ apiKey })

    const systemPrompt = `You are an expert Next.js developer. Generate a landing page. Raw JSON only.
    Plan: ${user.plan}
    Max Tokens allowed: ${userLimit.tokens}
    Watermark: ${user.plan === 'free' ? 'enabled' : 'disabled'}
    Prompt: ${prompt}`

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: userLimit.tokens,
      temperature: 0.7,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    // 5. Update Usage
    user.generationsUsed += 1
    await user.save()

    return NextResponse.json({
      ...result,
      usage: {
        used: user.generationsUsed,
        limit: userLimit.generations,
        remaining: userLimit.generations - user.generationsUsed
      }
    })
  } catch (error: any) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate project' },
      { status: 500 }
    )
  }
}
