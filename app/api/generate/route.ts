import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { isPromptOffensive } from '@/lib/moderation'

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
    if (user.plan === 'none') {
      return NextResponse.json({
        error: 'No active plan. Please subscribe to at least the Starter plan (₹1) to generate pages.',
        showUpgrade: true
      }, { status: 403 })
    }

    if (user.isSuspended) {
      return NextResponse.json({
        error: 'Your account has been suspended for violating our Terms of Service (repetitive abusive content).'
      }, { status: 403 })
    }

    // 4. Content Moderation (Local)
    if (isPromptOffensive(prompt)) {
      user.warnings = (user.warnings || 0) + 1
      if (user.warnings >= 3) {
        user.isSuspended = true
      }
      await user.save()

      const remainingWarnings = 3 - user.warnings
      const errorMsg = user.isSuspended
        ? 'Prompt flagged for abusive/harmful content. Your account has been suspended after multiple violations.'
        : `Warning: Your prompt was flagged for abusive/harmful content. You have ${remainingWarnings} warning(s) left before account suspension.`

      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    // OpenAI Setup
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 }
      )
    }
    const client = new OpenAI({ apiKey })

    const now = new Date()

    // Monthly Reset Check
    const lastMonthlyReset = new Date(user.lastResetDate)
    const isNewMonth = lastMonthlyReset.getMonth() !== now.getMonth() || lastMonthlyReset.getFullYear() !== now.getFullYear()

    if (isNewMonth) {
      user.generationsUsed = 0
      user.lastResetDate = now
    }

    // Daily Reset Check
    const lastDailyReset = new Date(user.lastDailyResetDate || user.lastResetDate)
    const isNewDay = lastDailyReset.toDateString() !== now.toDateString()

    if (isNewDay) {
      user.dailyGenerationsUsed = 0
      user.lastDailyResetDate = now
    }

    // Define limits
    const limits = {
      none: { generations: 0, dailyLimit: 0, tokens: 0 },
      free: { generations: 7, dailyLimit: 3, tokens: 1800 },
      pro: { generations: 100, dailyLimit: 100, tokens: 2500 },
      pro_plus: { generations: 300, dailyLimit: 300, tokens: 3500 },
    }

    const userPlanRaw = user.plan as keyof typeof limits
    const userLimit = limits[userPlanRaw] || limits.none

    // Check Monthly Limit
    if (user.generationsUsed >= userLimit.generations) {
      return NextResponse.json({
        error: `Monthly generation limit exceeded (${userLimit.generations} generations total). Please upgrade your plan.`
      }, { status: 403 })
    }

    // Check Daily Limit (Specifically for Free plan)
    if (user.plan === 'free' && user.dailyGenerationsUsed >= userLimit.dailyLimit) {
      return NextResponse.json({
        error: `Daily generation limit exceeded (Max ${userLimit.dailyLimit} per day). Please come back tomorrow or upgrade!`
      }, { status: 403 })
    }

    // 5. OpenAI Call
    // const apiKey already defined above

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
    user.dailyGenerationsUsed += 1
    await user.save()

    return NextResponse.json({
      ...result,
      usage: {
        used: user.generationsUsed,
        limit: userLimit.generations,
        remaining: userLimit.generations - user.generationsUsed,
        dailyUsed: user.dailyGenerationsUsed,
        dailyLimit: userLimit.dailyLimit
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
