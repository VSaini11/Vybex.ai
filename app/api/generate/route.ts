import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthToken, verifyToken } from '@/lib/auth'
import { isPromptOffensive } from '@/lib/moderation'
import { validateAndFixCode } from '@/lib/code-validator'
import { isQuotaError, VYANA_TIRED_ERROR } from '@/lib/ai-errors'

// ─────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function checkRateLimit(userId: string) {
  const now = Date.now()
  const entry = rateLimitMap.get(userId) || { count: 0, lastReset: now }
  if (now - entry.lastReset > 60_000) { entry.count = 0; entry.lastReset = now }
  if (entry.count >= 5) return false
  entry.count++
  rateLimitMap.set(userId, entry)
  return true
}

// ─────────────────────────────────────────
// Design Engine
// ─────────────────────────────────────────
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function pickDesignSystem() {
  return {
    seed: Math.random().toString(36).slice(2, 10),
    theme: pick(['dark', 'light']),
    bg: pick(['#0a0a0a', '#0f0f1a', '#fafafa', '#f0f4ff', '#0d0d0d']),
    accent: pick(['#6366f1', '#06b6d4', '#f43f5e', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6']),
    heroLayout: pick(['centered', 'split-left', 'split-right', 'asymmetric']),
    sectionOrder: pick([
      ['features', 'testimonials', 'cta'],
      ['features', 'stats', 'pricing', 'cta'],
      ['how-it-works', 'features', 'faq', 'cta'],
      ['features', 'case-studies', 'cta'],
      ['stats', 'features', 'testimonials', 'pricing', 'cta'],
    ]),
    visualMode: pick(['minimal-modern', 'bold-gradient-heavy', 'glass-saas', 'clean-enterprise', 'brutalist-editorial']),
    cardBorder: pick(['border border-white/10', 'border-2 border-dashed border-white/20', 'outline outline-1', 'shadow-xl ring-1 ring-white/5']),
    navStyle: pick(['transparent sticky', 'frosted-glass sticky', 'solid top bar', 'floating pill centered']),
    fontPairing: pick(['sans-serif bold/italic', 'serif headline + sans body', 'mono accent + sans body', 'display extrabold + regular']),
    heroVisual: pick(['abstract gradient blob', 'floating UI card mockup', 'terminal/code window', 'badge + icon cluster', 'large typographic element']),
    buttonShape: pick(['rounded-full', 'rounded-lg', 'rounded-none sharp', 'rounded-xl']),
  }
}

// ─────────────────────────────────────────
// STATIC system instruction (cached — no design vars here)
// ─────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are Vyana — an elite AI frontend engineer that creates premium landing pages.
Produce ONLY high-end, award-winning UI code.

NON-NEGOTIABLE UI RULES:
- First line MUST be exactly: 'use client'
- USE ONLY standard HTML elements (div, section, h1, p, button, etc.) and these 3 libraries:
  1. react (useState, useEffect, useMemo, useRef)
  2. framer-motion (motion, AnimatePresence)
  3. lucide-react (all icons)
- NEVER use components that are not defined in the code (e.g., do NOT use <FrostedGlass />, <Card /> unless you define them).
- GLASSMORPHISM: Use Tailwind classes like "bg-white/10 backdrop-blur-md border border-white/20". Do NOT use custom component names for this.
- COLORS: Strictly use the Background and Accent colors provided in the User Message.
- NO PLACEHOLDERS: Code must be 100% complete. No "Add content here" or "TODO".
- JSX SAFETY: Use normal "<" and ">" operators in JavaScript/TypeScript logic (e.g., in loops or if-statements). In JSX text content, if you need to show these symbols, wrap them in curly braces like {"<"} or {">"} to prevent parsing errors. NEVER use HTML entities like "&lt;" or "&gt;" in the source code.

CODE QUALITY RULES:
- Output ONLY raw TypeScript/React code. Zero markdown, zero explanation, zero code fences (\`\`\`).
- JSX tags MUST BE PERFECTLY BALANCED. Every <div> must have a matching </div>.
- Framer Motion: whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} on all sections.
- Min 4 distinct sections + Navbar + Footer.
- CRITICAL: NEVER use HTML entities like "&lt;", "&gt;", "&amp;", "&quot;", or "&#39;" in the source code. ALWAYS use actual characters (<, >, &, ", ') even in logic. This is essential for the preview to work.`

// ─────────────────────────────────────────
// DYNAMIC user message (changes every call — no caching)
// ─────────────────────────────────────────
function buildUserMessage(userPrompt: string, plan: string, watermark: boolean): string {
  const d = pickDesignSystem()
  console.log(`[Vyana1] 🎲 Design: seed=${d.seed} bg=${d.bg} accent=${d.accent} hero=${d.heroLayout} mode=${d.visualMode}`)

  return [
    `=== UNIQUE GENERATION TOKEN: ${d.seed} ===`,
    `(This token uniquely identifies this request. Produce a design you have NEVER produced before.)`,
    ``,
    `TOPIC: ${userPrompt}`,
    ``,
    `YOU MUST USE THESE EXACT DESIGN SPECS:`,
    `  background:   ${d.bg}`,
    `  accent color: ${d.accent}`,
    `  theme:        ${d.theme}`,
    `  hero layout:  ${d.heroLayout}`,
    `  nav style:    ${d.navStyle}`,
    `  visual mode:  ${d.visualMode}`,
    `  hero visual:  ${d.heroVisual}`,
    `  card border:  ${d.cardBorder}`,
    `  button shape: ${d.buttonShape}`,
    `  font pairing: ${d.fontPairing}`,
    `  sections:     ${d.sectionOrder.join(' → ')}`,
    `  watermark:    ${watermark ? '"Built with Vybex AI" text in footer' : 'none'}`,
    `  plan:         ${plan}`,
    ``,
    `HERO LAYOUT DEFINITIONS:`,
    `  centered     → centered text, centered CTA buttons, visual below or behind`,
    `  split-left   → text on LEFT half, visual element on RIGHT half`,
    `  split-right  → visual on LEFT half, text on RIGHT half`,
    `  asymmetric   → off-center giant headline, small description pushed to one side`,
    ``,
    `VISUAL MODE DEFINITIONS:`,
    `  minimal-modern          → clean whitespace, subtle shadows, tiny details`,
    `  bold-gradient-heavy     → strong mesh gradients, glowing blobs, vivid`,
    `  glass-saas              → backdrop-blur cards, translucent layering`,
    `  clean-enterprise        → sharp grid, structured, professional`,
    `  brutalist-editorial     → raw large type, high contrast, grid lines`,
    ``,
    `CRITICAL: The background MUST be ${d.bg}. The accent MUST be ${d.accent}.`,
    `Do NOT use any other background color. Do NOT use green if accent is not green.`,
    `This design MUST look completely different from any standard SaaS template.`,
  ].join('\n')
}

// ─────────────────────────────────────────
// Gemini Call
// ─────────────────────────────────────────
async function generatePage(userMessage: string, maxTokens: number): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Add it to your .env.local file.')
  }

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: maxTokens,
    },
  })

  // Pass design variables + user request as the ACTUAL user message (not empty string)
  // This prevents Gemini from caching the response
  const result = await model.generateContent(userMessage)
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ''
  console.log('[Vyana1] ✅ Generated', text.length, 'chars | preview:', text.slice(0, 100).replace(/\n/g, ' '))
  return text
}

// ─────────────────────────────────────────
// Build Project Structure
// ─────────────────────────────────────────
function buildProject(pageTsx: string) {
  const layoutTsx = `'use client'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`

  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
}

* { box-sizing: border-box; }
body { 
  -webkit-font-smoothing: antialiased;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
html { scroll-behavior: smooth; }`

  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
    },
  },
  plugins: [],
}
export default config`

  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`

  const packageJson = JSON.stringify({
    name: 'vybex-generated-app',
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.400.0',
      'next': '14.2.0',
      'react': '^18',
      'react-dom': '^18',
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.2.0'
    },
    devDependencies: {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      'autoprefixer': '^10.0.1',
      'postcss': '^8',
      'tailwindcss': '^3.4.1',
      'typescript': '^5'
    },
  }, null, 2)

  return {
    files: [
      { name: 'page.tsx', path: 'app/page.tsx', type: 'file' as const, language: 'typescript' },
      { name: 'layout.tsx', path: 'app/layout.tsx', type: 'file' as const, language: 'typescript' },
      { name: 'globals.css', path: 'app/globals.css', type: 'file' as const, language: 'css' },
      { name: 'tailwind.config.ts', path: 'tailwind.config.ts', type: 'file' as const, language: 'typescript' },
      { name: 'postcss.config.js', path: 'postcss.config.js', type: 'file' as const, language: 'javascript' },
      { name: 'package.json', path: 'package.json', type: 'file' as const, language: 'json' },
    ],
    fileMap: {
      'app/page.tsx': { content: pageTsx, language: 'typescript' },
      'app/layout.tsx': { content: layoutTsx, language: 'typescript' },
      'app/globals.css': { content: globalsCss, language: 'css' },
      'tailwind.config.ts': { content: tailwindConfig, language: 'typescript' },
      'postcss.config.js': { content: postcssConfig, language: 'javascript' },
      'package.json': { content: packageJson, language: 'json' },
    },
  }
}

// ─────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req)
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const decoded: any = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })

    if (!checkRateLimit(decoded.userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded (5 req/min)' }, { status: 429 })
    }

    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    await connectDB()
    const user = await User.findById(decoded.userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user.plan === 'none') {
      return NextResponse.json({
        error: 'No active plan. Please subscribe to the Starter plan to generate pages.',
        showUpgrade: true,
      }, { status: 403 })
    }

    if (user.isSuspended) {
      return NextResponse.json({ error: 'Your account has been suspended.' }, { status: 403 })
    }

    if (isPromptOffensive(prompt)) {
      user.warnings = (user.warnings || 0) + 1
      if (user.warnings >= 3) user.isSuspended = true
      await user.save()
      const remaining = 3 - user.warnings
      const msg = user.isSuspended
        ? 'Prompt flagged. Account suspended after multiple violations.'
        : `Warning: Prompt flagged. ${remaining} warning(s) left.`
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const now = new Date()

    const lastMonthly = new Date(user.lastResetDate)
    if (lastMonthly.getMonth() !== now.getMonth() || lastMonthly.getFullYear() !== now.getFullYear()) {
      user.generationsUsed = 0
      user.lastResetDate = now
    }

    const lastDaily = new Date(user.lastDailyResetDate || user.lastResetDate)
    if (lastDaily.toDateString() !== now.toDateString()) {
      user.dailyGenerationsUsed = 0
      user.lastDailyResetDate = now
    }

    const limits = {
      none: { generations: 0, dailyLimit: 0, tokens: 0 },
      free: { generations: 20, dailyLimit: 20, tokens: 16384 },
      pro: { generations: 100, dailyLimit: 100, tokens: 32768 },
      pro_plus: { generations: 300, dailyLimit: 300, tokens: 65536 },
    }
    const planKey = user.plan as keyof typeof limits
    const userLimit = limits[planKey] || limits.none

    if (user.generationsUsed >= userLimit.generations) {
      return NextResponse.json({ error: `Monthly limit exceeded (${userLimit.generations} total). Please upgrade.` }, { status: 403 })
    }

    if (user.plan === 'free' && user.dailyGenerationsUsed >= userLimit.dailyLimit) {
      return NextResponse.json({ error: `Daily limit exceeded (${userLimit.dailyLimit}/day). Come back tomorrow or upgrade!` }, { status: 403 })
    }

    // Build a unique user message with design variables embedded
    let userMessage = buildUserMessage(prompt, user.plan, user.plan === 'free')
    let attempts = 0
    let finalCode = ''
    let lastError = ''

    while (attempts < 3) {
      const promptToUse = attempts === 0
        ? userMessage
        : `Fix all syntax errors in this code and return full corrected file:\n\n${finalCode}\n\nError: ${lastError}`

      const rawPage = await generatePage(promptToUse, userLimit.tokens)

      // Strip accidental markdown fences
      let codeStr = rawPage
        .trim()
        .replace(/^```(?:tsx?|jsx?|typescript)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim()

      // Validate and Fix the code (handles HTML entities, 'use client', etc.)
      const { isValid, code: cleaned, error: validationError } = validateAndFixCode(codeStr)

      finalCode = cleaned
      if (isValid && cleaned.length >= 200) {
        break
      }

      attempts++
      lastError = validationError || 'Code too short or invalid structure'
      console.warn(`[Vyana1] ⚠️ Syntax Error (Attempt ${attempts}):`, lastError)
    }

    if (finalCode.length < 200) {
      throw new Error('AI failed to generate valid code after multiple attempts.')
    }

    const project = buildProject(finalCode)

    user.generationsUsed += 1
    user.dailyGenerationsUsed += 1
    await user.save()

    return NextResponse.json({
      ...project,
      usage: {
        used: user.generationsUsed,
        limit: userLimit.generations,
        remaining: userLimit.generations - user.generationsUsed,
        dailyUsed: user.dailyGenerationsUsed,
        dailyLimit: userLimit.dailyLimit,
      },
    })
  } catch (err: any) {
    console.error('AI Generation Error:', err)
    if (isQuotaError(err)) {
      return NextResponse.json({ error: VYANA_TIRED_ERROR }, { status: 429 })
    }
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}
