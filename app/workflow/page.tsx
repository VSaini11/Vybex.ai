'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import {
    ArrowLeft, Copy, Check, ChevronRight, Zap, Layers,
    ListChecks, Sparkles, Terminal, ExternalLink, ArrowRight
} from 'lucide-react'

interface FunnelStep {
    step_number: number
    step_title: string
    what_to_do: string
    recommended_tool: string
    why_this_tool: string
    prompt_to_use: string
}

interface WorkflowData {
    goal: string
    analysis: string
    execution_funnel: FunnelStep[]
    enhancement_layer: string[]
    final_optimization_checklist: string[]
}

export default function WorkflowPage() {
    return (
        <Suspense fallback={<FullPageSpinner />}>
            <WorkflowPageInner />
        </Suspense>
    )
}

function FullPageSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#030303' }}>
            <div className="w-8 h-8 rounded-full border-2 border-[#00ff41]/30 border-t-[#00ff41] animate-spin" />
        </div>
    )
}

function WorkflowPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const goal = searchParams.get('goal') ?? ''

    const [data, setData] = useState<WorkflowData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (!goal) { router.replace('/'); return }

        const fetchWorkflow = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/vyana2', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ goal }),
                })
                if (!res.ok) throw new Error(`Server error: ${res.status}`)
                const json = await res.json()
                if (json.error) throw new Error(json.error)
                setData(json)
            } catch (err: any) {
                setError(err.message || 'Something went wrong.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkflow()
    }, [goal, router])

    const copyPrompt = useCallback((text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index)
            setTimeout(() => setCopiedIndex(null), 2500)
        })
    }, [])

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#000000' }}>
            {/* Global ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Deep vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(10,10,10,0) 0%, #000 100%)' }} />
                {/* Subtle accent glows — very faint, blurred far out */}
                <div className="absolute -top-20 left-1/4 w-[900px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.025) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.018) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.018) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                {/* Ultra-fine grid — barely visible, classy texture */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 90% 90% at 50% 10%, black 30%, transparent 100%)'
                }} />
                {/* Bottom fade to solid black */}
                <div className="absolute bottom-0 inset-x-0 h-64" style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />
            </div>

            {/* Navbar */}
            <TopNav onBack={() => router.push('/')} />

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <LoadingState key="loading" goal={goal} />
                ) : error ? (
                    <ErrorState key="error" message={error} onRetry={() => router.push('/')} />
                ) : data ? (
                    <WorkflowResult key="result" data={data} copiedIndex={copiedIndex} onCopy={copyPrompt} />
                ) : null}
            </AnimatePresence>
        </div>
    )
}

/* ─── Top Nav ────────────────────────────────────────────────────────── */
function TopNav({ onBack }: { onBack: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 border-b border-white/[0.05] bg-[#030303]/80 backdrop-blur-2xl"
        >
            <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 text-sm font-medium text-white/60 hover:text-white"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline">Back to Vybex</span>
                    <span className="sm:hidden">Back</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff41]/20 bg-[#00ff41]/5">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"
                            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00ff41]">Vyana 2.0</span>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono hidden sm:block">AI Workflow Architect</span>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── Loading State ─────────────────────────────────────────────────── */
function LoadingState({ goal }: { goal: string }) {
    const messages = [
        { icon: '⚡', text: 'Analyzing your goal…' },
        { icon: '🧠', text: 'Architecting execution funnel…' },
        { icon: '🔍', text: 'Selecting optimal AI tools…' },
        { icon: '✍️', text: 'Crafting precision prompts…' },
        { icon: '🚀', text: 'Structuring workflow layers…' },
        { icon: '✨', text: 'Finalizing optimization layer…' },
    ]
    const [idx, setIdx] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const msgInterval = setInterval(() => setIdx(i => (i + 1) % messages.length), 1600)
        const progressInterval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 12, 95)), 200)
        return () => { clearInterval(msgInterval); clearInterval(progressInterval) }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4"
        >
            {/* Central orb system */}
            <div className="relative flex items-center justify-center mb-16" style={{ width: 200, height: 200 }}>
                {/* Outer rings */}
                {[180, 150, 120].map((size, i) => (
                    <motion.div
                        key={size}
                        className="absolute rounded-full border border-[#00ff41]/10"
                        style={{ width: size, height: size }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
                        transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
                    />
                ))}
                {/* Pulsing glow rings */}
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={`glow-${i}`}
                        className="absolute rounded-full"
                        style={{ width: 80 + i * 20, height: 80 + i * 20, background: 'radial-gradient(circle, rgba(0,255,65,0.08), transparent)' }}
                        animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                ))}
                {/* Core orb */}
                <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center z-10"
                    style={{
                        background: 'radial-gradient(circle at 35% 35%, rgba(0,255,65,0.3), rgba(0,255,65,0.05) 60%, transparent)',
                        boxShadow: '0 0 40px rgba(0,255,65,0.3), 0 0 80px rgba(0,255,65,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                        border: '1px solid rgba(0,255,65,0.4)',
                    }}
                >
                    <Sparkles className="w-9 h-9 text-[#00ff41]" />
                </div>
                {/* Orbiting dot */}
                <motion.div
                    className="absolute w-2.5 h-2.5 rounded-full bg-[#00ff41] shadow-[0_0_12px_#00ff41]"
                    style={{ top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    transformTemplate={({ rotate }) => `translate(-50%, -50%) rotate(${rotate}) translateX(80px)`}
                />
            </div>

            <motion.h2
                className="text-3xl md:text-4xl font-black text-white mb-4 text-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                Designing Your Execution Funnel
            </motion.h2>

            <p className="text-white/30 text-sm max-w-md text-center mb-10 leading-relaxed">
                &ldquo;{goal}&rdquo;
            </p>

            {/* Message ticker */}
            <div className="h-7 flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        className="flex items-center gap-2.5"
                    >
                        <span className="text-lg">{messages[idx].icon}</span>
                        <span className="text-xs font-mono font-semibold tracking-[0.15em] uppercase text-[#00ff41]/80">
                            {messages[idx].text}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-72 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00ff41, #00cc33, #00ff41)', backgroundSize: '200% 100%' }}
                    animate={{ width: `${progress}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
                    transition={{ width: { duration: 0.4 }, backgroundPosition: { duration: 2, repeat: Infinity } }}
                />
            </div>
            <p className="text-[10px] text-white/20 font-mono mt-2">{Math.round(progress)}% complete</p>
        </motion.div>
    )
}

/* ─── Error State ────────────────────────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
        >
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 text-4xl">⚠️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Workflow Generation Failed</h3>
            <p className="text-sm text-white/40 mb-10 max-w-sm leading-relaxed">{message}</p>
            <button onClick={onRetry} className="px-8 py-3.5 rounded-2xl bg-[#00ff41] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all" style={{ boxShadow: '0 0 30px rgba(0,255,65,0.3)' }}>
                Try Again
            </button>
        </motion.div>
    )
}

/* ─── Main Workflow Result ──────────────────────────────────────────── */
function WorkflowResult({ data, copiedIndex, onCopy }: {
    data: WorkflowData
    copiedIndex: number | null
    onCopy: (text: string, idx: number) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
        >
            {/* ── Hero Header ─────────────────────── */}
            <HeroHeader goal={data.goal} analysis={data.analysis} stepCount={data.execution_funnel.length} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 space-y-24">
                {/* ── Execution Funnel ─────────────── */}
                <FunnelSection steps={data.execution_funnel} copiedIndex={copiedIndex} onCopy={onCopy} />

                {/* ── Enhancement Layer ─────────────── */}
                {data.enhancement_layer?.length > 0 && (
                    <EnhancementSection items={data.enhancement_layer} />
                )}

                {/* ── Optimization Checklist ─────────── */}
                {data.final_optimization_checklist?.length > 0 && (
                    <ChecklistSection items={data.final_optimization_checklist} />
                )}

                {/* ── Footer CTA ─────────────────────── */}
                <FooterCTA />
            </div>
        </motion.div>
    )
}

/* ─── Hero Header ────────────────────────────────────────────────────── */
function HeroHeader({ goal, analysis, stepCount }: { goal: string; analysis: string; stepCount: number }) {
    return (
        <div className="relative overflow-hidden">
            {/* Scan line effect */}
            <motion.div
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00ff41]/30 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center gap-2.5 mb-8"
                >
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,255,65,0.12), rgba(0,255,65,0.04))',
                            border: '1px solid rgba(0,255,65,0.25)',
                            color: '#00ff41',
                            boxShadow: '0 0 20px rgba(0,255,65,0.08)',
                        }}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        AI Execution Funnel
                    </div>
                    <div className="h-px w-8 bg-gradient-to-r from-[#00ff41]/30 to-transparent" />
                    <span className="text-[10px] font-mono text-white/30">{stepCount} steps mapped</span>
                </motion.div>

                {/* Main title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6"
                >
                    <span className="text-white">{goal.split(' ').slice(0, Math.ceil(goal.split(' ').length / 2)).join(' ')}</span>
                    <br />
                    <span style={{ background: 'linear-gradient(135deg, #00ff41, #00cc33, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {goal.split(' ').slice(Math.ceil(goal.split(' ').length / 2)).join(' ')}
                    </span>
                </motion.h1>

                {/* Analysis */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="text-white/45 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                    {analysis}
                </motion.p>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-8 mt-10"
                >
                    {[
                        { value: `${stepCount}`, label: 'Steps' },
                        { value: '100%', label: 'Free Tools' },
                        { value: 'Now', label: 'Ready to Execute' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl font-black text-[#00ff41]">{stat.value}</div>
                            <div className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
        </div>
    )
}

/* ─── Funnel Section ─────────────────────────────────────────────────── */
function FunnelSection({ steps, copiedIndex, onCopy }: {
    steps: FunnelStep[]
    copiedIndex: number | null
    onCopy: (text: string, idx: number) => void
}) {
    return (
        <section>
            <SectionLabel icon={<Layers className="w-3.5 h-3.5" />} label="Execution Funnel" accent="#00ff41" />

            <div className="relative mt-10">
                {/* Timeline vertical line */}
                <div className="absolute left-[22px] top-0 bottom-0 w-px hidden sm:block" style={{ background: 'linear-gradient(to bottom, rgba(0,255,65,0.3), rgba(0,255,65,0.05) 90%, transparent)' }} />

                <div className="space-y-10 sm:space-y-6">
                    {steps.map((step, i) => (
                        <StepCard
                            key={step.step_number}
                            step={step}
                            index={i}
                            total={steps.length}
                            isCopied={copiedIndex === i}
                            onCopy={() => onCopy(step.prompt_to_use, i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── Step Card ──────────────────────────────────────────────────────── */
function StepCard({ step, index, total, isCopied, onCopy }: {
    step: FunnelStep
    index: number
    total: number
    isCopied: boolean
    onCopy: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })
    const [expanded, setExpanded] = useState(true)
    const [isPromptExpanded, setIsPromptExpanded] = useState(false)

    const isLast = index === total - 1
    const accent = '#00ff41'

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex gap-4 sm:gap-6"
        >
            {/* Timeline node */}
            <div className="flex-shrink-0 flex flex-col items-center">
                <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black z-10 cursor-default"
                    style={{
                        background: `linear-gradient(135deg, rgba(0,255,65,0.2), rgba(0,255,65,0.06))`,
                        border: `1px solid rgba(0,255,65,0.35)`,
                        color: accent,
                        boxShadow: `0 0 20px rgba(0,255,65,0.12)`,
                    }}
                >
                    {step.step_number}
                    {/* Glow pulse */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{ boxShadow: `0 0 0 0 rgba(0,255,65,0.4)` }}
                        animate={{ boxShadow: ['0 0 0 0 rgba(0,255,65,0.4)', '0 0 0 10px rgba(0,255,65,0)', '0 0 0 0 rgba(0,255,65,0)'] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                    />
                </motion.div>
            </div>

            {/* Card body */}
            <motion.div
                whileHover={{ y: -2, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,65,0.12)' }}
                transition={{ duration: 0.2 }}
                className="flex-1 rounded-2xl overflow-hidden mb-2"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                }}
            >
                {/* Card header */}
                <div className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold text-white leading-tight">{step.step_title}</h3>
                        {/* Tool pill */}
                        <div
                            className="flex-shrink-0 w-fit flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                            style={{
                                background: 'rgba(0,255,65,0.08)',
                                border: '1px solid rgba(0,255,65,0.2)',
                                color: '#00ff41',
                            }}
                        >
                            <Zap className="w-2.5 h-2.5" />
                            {step.recommended_tool}
                        </div>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">{step.what_to_do}</p>

                    {/* Why this tool */}
                    <div className="mt-3 flex items-start gap-2">
                        <div className="mt-0.5 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] text-white/40">i</span>
                        </div>
                        <p className="text-xs text-white/30 leading-relaxed italic">{step.why_this_tool}</p>
                    </div>
                </div>

                {/* Prompt terminal block */}
                <div className="mx-4 mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,255,65,0.08)', background: 'rgba(0,0,0,0.5)' }}>
                    {/* Terminal header bar */}
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 ml-2 text-[10px] text-white/20 font-mono truncate">
                                <Terminal className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">prompt.txt</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCopy}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                            style={{
                                background: isCopied ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.05)',
                                border: isCopied ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                color: isCopied ? '#00ff41' : 'rgba(255,255,255,0.4)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isCopied ? (
                                    <motion.span key="copied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5">
                                        <Check className="w-3 h-3" />
                                        <span className="hidden sm:inline text-nowrap">Copied!</span>
                                    </motion.span>
                                ) : (
                                    <motion.span key="copy" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5">
                                        <Copy className="w-3 h-3" />
                                        <span className="hidden sm:inline text-nowrap">Copy Prompt</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    {/* Prompt text */}
                    <div
                        className={`relative px-5 py-4 overflow-hidden transition-all duration-500 ease-in-out ${!isPromptExpanded && step.prompt_to_use.length > 300 ? 'max-h-[240px] sm:max-h-none mb-2' : ''}`}
                    >
                        <span className="text-[#00ff41]/40 font-mono text-xs mr-2 select-none">{'>'}</span>
                        <span className="text-[12px] sm:text-xs text-white/55 leading-relaxed font-mono whitespace-pre-wrap break-words">{step.prompt_to_use}</span>
                        {/* Blinking cursor */}
                        <motion.span
                            className="inline-block w-2 h-3 bg-[#00ff41]/50 ml-1 align-middle"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        />

                        {/* Gradient fade and Show More toggle for mobile */}
                        {!isPromptExpanded && step.prompt_to_use.length > 300 && (
                            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#000] via-[#000]/90 to-transparent flex items-end justify-center pb-2 sm:hidden pointer-events-none">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsPromptExpanded(true);
                                    }}
                                    className="pointer-events-auto text-[10px] font-black tracking-widest text-[#00ff41] bg-[#00ff41]/10 px-4 py-1.5 rounded-full border border-[#00ff41]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,65,0.15)] flex items-center gap-1.5"
                                >
                                    SHOW ENTIRE PROMPT
                                    <ChevronRight className="w-3 h-3 rotate-90" />
                                </button>
                            </div>
                        )}

                        {/* Show Less toggle when expanded on mobile */}
                        {isPromptExpanded && step.prompt_to_use.length > 300 && (
                            <div className="mt-4 flex justify-center sm:hidden">
                                <button
                                    onClick={() => setIsPromptExpanded(false)}
                                    className="text-[10px] font-black tracking-widest text-white/40 hover:text-[#00ff41] transition-colors flex items-center gap-1.5"
                                >
                                    SHOW LESS
                                    <ChevronRight className="w-3 h-3 -rotate-90" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── Enhancement Section ────────────────────────────────────────────── */
function EnhancementSection({ items }: { items: string[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <section ref={ref}>
            <SectionLabel icon={<Sparkles className="w-3.5 h-3.5" />} label="Enhancement Layer" accent="#7c3aed" />

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15)' }}
                        className="group relative flex gap-4 p-5 rounded-2xl overflow-hidden cursor-default"
                        style={{
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(124,58,237,0.02) 100%)',
                            border: '1px solid rgba(124,58,237,0.12)',
                        }}
                    >
                        {/* Purple glow on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 70%)' }} />

                        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <p className="relative text-sm text-white/65 leading-relaxed">{item}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

/* ─── Checklist Section ──────────────────────────────────────────────── */
function ChecklistSection({ items }: { items: string[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <section ref={ref}>
            <SectionLabel icon={<ListChecks className="w-3.5 h-3.5" />} label="Final Optimization Checklist" accent="#2563eb" />

            <div
                className="mt-10 rounded-3xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(37,99,235,0.02))',
                    border: '1px solid rgba(37,99,235,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="group flex items-start gap-5 px-6 py-4 hover:bg-white/[0.025] transition-colors duration-200"
                        style={i < items.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.03)' } : {}}
                    >
                        {/* Checkbox */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                            style={{
                                background: 'rgba(37,99,235,0.1)',
                                border: '1.5px solid rgba(37,99,235,0.4)',
                                boxShadow: '0 0 10px rgba(37,99,235,0.1)',
                            }}
                        >
                            <Check className="w-2.5 h-2.5 text-blue-400" />
                        </motion.div>

                        <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-200">{item}</p>

                        {/* Progress indicator */}
                        <div className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-white/20" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

/* ─── Footer CTA ─────────────────────────────────────────────────────── */
function FooterCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl text-center py-16 px-8"
            style={{
                background: 'linear-gradient(135deg, rgba(0,255,65,0.06) 0%, rgba(124,58,237,0.06) 50%, rgba(37,99,235,0.06) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Background orbs */}
            {[
                { color: '#00ff41', pos: { top: '-40%', left: '-10%' }, size: 300 },
                { color: '#7c3aed', pos: { top: '-20%', right: '-10%' }, size: 250 },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{ ...orb.pos, width: orb.size, height: orb.size, background: `radial-gradient(circle, ${orb.color}08, transparent)`, filter: 'blur(40px)' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4 + i, repeat: Infinity, delay: i }}
                />
            ))}

            <div className="relative z-10">
                <div className="text-sm font-mono text-white/20 mb-4 tracking-widest uppercase">Powered by Vyana 2.0 · Built by Vybex Studio</div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to Build?</h3>
                <p className="text-white/40 text-base mb-10 max-w-md mx-auto leading-relaxed">
                    Your workflow is mapped. Now execute it step by step using the prompts above. Or generate a landing page for your project.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,255,65,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { window.location.href = '/' }}
                        className="px-8 py-3.5 rounded-2xl text-sm font-black tracking-wide"
                        style={{ background: 'linear-gradient(135deg, #00ff41, #00cc33)', color: '#000', boxShadow: '0 0 24px rgba(0,255,65,0.25)' }}
                    >
                        Launch Vyana 1.0 Builder
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { window.location.href = '/' }}
                        className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white/70 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        New Workflow
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── Section Label ──────────────────────────────────────────────────── */
function SectionLabel({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full" style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent }}>
                {icon}
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
            </div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}20, transparent)` }} />
        </div>
    )
}
