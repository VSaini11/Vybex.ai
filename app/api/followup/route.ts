import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { validateAndFixCode } from '@/lib/code-validator'

const SYSTEM_INSTRUCTION = `You are Vyana 2.1 — an elite AI frontend engineer specialized in refining and perfecting landing pages.
You receive existing code and a refinement instruction. Your goal is to apply the instruction while maintaining the premium quality, animations, and structure of the original code.

NON-NEGOTIABLE UI RULES:
- First line MUST be exactly: 'use client'
- USE ONLY standard HTML elements and these 3 libraries:
  1. react
  2. framer-motion
  3. lucide-react
- NEVER use components that are not defined in the code.
- Output ONLY raw TypeScript/React code. Zero markdown, zero explanation, zero code fences.
- JSX tags MUST BE PERFECTLY BALANCED.
- Preserve the existing design system (colors, spacing, fonts) unless explicitly told to change them.
- Ensure the refinement is applied smoothly without breaking existing features.
- CRITICAL: NEVER use HTML entities like "&lt;", "&gt;", "&amp;", "&quot;", or "&#39;" in the source code. ALWAYS use actual characters (<, >, &, ", ') even in logic.`

async function refinePage(originalPrompt: string, currentCode: string, followupMessage: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
        throw new Error('GEMINI_API_KEY is not configured.')
    }

    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 32768,
        },
    })

    const prompt = [
        `ORIGINAL GOAL: ${originalPrompt}`,
        `CURRENT CODE:\n${currentCode}`,
        `REFINEMENT INSTRUCTION: ${followupMessage}`,
        ``,
        `Apply the refinement instruction to the code above. Return the FULL updated code for page.tsx.`
    ].join('\n')

    const result = await model.generateContent(prompt)
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return text
}

export async function POST(req: NextRequest) {
    try {
        const { originalPrompt, currentCode, followupMessage } = await req.json()

        if (!currentCode || !followupMessage) {
            return NextResponse.json({ error: 'Current code and follow-up message are required' }, { status: 400 })
        }

        let attempts = 0
        let finalCode = ''
        let lastError = ''
        let currentIterativeCode = currentCode

        while (attempts < 3) {
            const promptToUse = attempts === 0
                ? followupMessage
                : `Fix all syntax errors in this code and return full corrected file:\n\n${finalCode}\n\nError: ${lastError}`

            const refinedCode = await refinePage(originalPrompt, (attempts === 0 ? currentIterativeCode : finalCode), promptToUse)

            // Strip accidental markdown fences
            let codeStr = refinedCode
                .trim()
                .replace(/^```(?:tsx?|jsx?|typescript)?\s*/i, '')
                .replace(/\s*```$/, '')
                .trim()

            // Validate and Fix the code (handles HTML entities, 'use client', etc.)
            const { isValid, code: cleaned, error: validationError } = validateAndFixCode(codeStr)

            finalCode = cleaned
            if (isValid) {
                break
            }

            attempts++
            lastError = validationError || 'Invalid code structure'
            console.warn(`[Vyana1] ⚠️ Refinement Syntax Error (Attempt ${attempts}):`, lastError)
        }

        // Mock project structure (reusing original logic but with new page.tsx)
        // In a real scenario, we might want to preserve other files too if they changed
        const project = {
            files: [
                {
                    name: 'app',
                    path: 'app',
                    type: 'folder' as const,
                    children: [
                        { name: 'page.tsx', path: 'app/page.tsx', type: 'file' as const, language: 'typescript' },
                        { name: 'layout.tsx', path: 'app/layout.tsx', type: 'file' as const, language: 'typescript' },
                        { name: 'globals.css', path: 'app/globals.css', type: 'file' as const, language: 'css' },
                    ],
                },
                { name: 'tailwind.config.ts', path: 'tailwind.config.ts', type: 'file' as const, language: 'typescript' },
                { name: 'package.json', path: 'package.json', type: 'file' as const, language: 'json' },
            ],
            fileMap: {
                'app/page.tsx': { content: finalCode, language: 'typescript' },
                'app/layout.tsx': {
                    content: `'use client'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
                    language: 'typescript'
                },
                'app/globals.css': {
                    content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
                    language: 'css'
                },
                'tailwind.config.ts': {
                    content: `import type { Config } from 'tailwindcss'\nconst config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: {} }, plugins: [] }\nexport default config`,
                    language: 'typescript'
                },
                'package.json': {
                    content: `{"name":"vybex-app","version":"0.1.0","dependencies":{"framer-motion":"^11.0.0","lucide-react":"^0.400.0","next":"14.2.0","react":"^18","react-dom":"^18"}}`,
                    language: 'json'
                },
            }
        }

        return NextResponse.json(project)
    } catch (err: any) {
        console.error('AI Refinement Error:', err)
        return NextResponse.json({ error: err.message || 'Refinement failed' }, { status: 500 })
    }
}
