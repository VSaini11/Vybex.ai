'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Copy, Check, Zap, Sparkles, Terminal, FileText, Image as ImageIcon, Search,
    Database, Shield, Cpu, Layers, Target, TrendingUp
} from 'lucide-react'
import TiredVyana from '@/components/tired-vyana'
import { VYANA_TIRED_ERROR } from '@/lib/ai-errors'
import { sessionStore } from '@/lib/session-store'

export default function ExtractPage() {
    return (
        <Suspense fallback={<FullPageSpinner />}>
            <ExtractPageInner />
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

function ExtractPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const prompt = searchParams.get('prompt') ?? ''
    const fileKey = searchParams.get('fileKey') ?? ''

    const [extraction, setExtraction] = useState<string | null>(null)
    const [file, setFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!prompt && !fileKey) { router.replace('/'); return }

        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                let uploadedFile = null
                if (fileKey) {
                    const stored = sessionStore.get(fileKey)
                    if (stored) {
                        uploadedFile = stored
                        setFile(uploadedFile)
                    }
                }

                const res = await fetch('/api/vyana3', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, file: uploadedFile }),
                })

                if (!res.ok) {
                    const errorJson = await res.json().catch(() => ({}));
                    if (errorJson.error === VYANA_TIRED_ERROR) throw new Error(VYANA_TIRED_ERROR);
                    throw new Error(errorJson.error || `Server error: ${res.status}`);
                }
                const json = await res.json()
                if (json.error === VYANA_TIRED_ERROR) throw new Error(VYANA_TIRED_ERROR);
                if (json.error) throw new Error(json.error)

                setExtraction(json.response)
            } catch (err: any) {
                setError(err.message || 'Something went wrong.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [prompt, fileKey, router])

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
    }, [])

    return (
        <main className="min-h-screen text-white overflow-x-hidden relative z-10" style={{ background: '#000000' }}>
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(10,10,10,0) 0%, #000 100%)' }} />
                <div className="absolute -top-20 left-1/4 w-[900px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.025) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.018) 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse 90% 90% at 50% 10%, black 20%, transparent 100%)'
                }} />
            </div>

            {/* Navbar */}
            <header className="relative z-50 border-b border-white/[0.05] bg-[#030303]/80 backdrop-blur-2xl">
                <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="group flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 text-sm font-medium text-white/60 hover:text-white"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff41]/20 bg-[#00ff41]/5">
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"
                                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00ff41]">Vyana 3.0</span>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <LoadingState prompt={prompt} />
                ) : error ? (
                    <ErrorState message={error} onRetry={() => router.push('/')} />
                ) : extraction ? (
                    <ExtractionResult
                        prompt={prompt}
                        file={file}
                        extraction={extraction}
                        onCopy={() => copyToClipboard(extraction)}
                        isCopied={copied}
                        onBack={() => router.push('/')}
                    />
                ) : null}
            </AnimatePresence>
        </main>
    )
}

function LoadingState({ prompt }: { prompt: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4"
        >
            <div className="relative mb-12">
                <motion.div
                    className="w-24 h-24 rounded-3xl border border-[#00ff41]/20 bg-[#00ff41]/5 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                    <Search className="w-10 h-10 text-[#00ff41]" />
                </motion.div>
                <div className="absolute inset-0 bg-[#00ff41]/10 blur-2xl rounded-full" />
            </div>
            <h2 className="text-3xl font-black mb-4">Scanning Multimodal Data...</h2>
            <p className="text-white/40 text-sm max-w-sm text-center italic">"{prompt || 'Analyzing file...'}"</p>
        </motion.div>
    )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    if (message === VYANA_TIRED_ERROR) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <TiredVyana onRetry={onRetry} />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center"
        >
            <div className="relative mb-12">
                <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative z-10">
                    <span className="text-4xl text-red-500">⚠️</span>
                </div>
                <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full -z-10" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">Extraction Failed</h3>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-sm">{message}</p>
            <button
                onClick={onRetry}
                className="px-10 py-4 rounded-2xl bg-[#00ff41] text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,65,0.3)]"
            >
                Try Again
            </button>
        </motion.div>
    )
}

interface ExtractionData {
    summary: string;
    insights: Array<{ title: string; description: string; icon: string }>;
    flow: Array<{ step: number; title: string; description: string; icon: string }>;
    graphic_type: string;
    raw_analysis: string;
}

function TypewriterText({ text, speed = 2, delay = 0 }: { text: string; speed?: number; delay?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let i = 0;
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    setIsFinished(true);
                }
            }, speed);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [text, speed, delay]);

    return (
        <span className="relative">
            {displayedText}
            {!isFinished && (
                <motion.span
                    className="inline-block w-1 h-4 bg-accent/50 ml-0.5 align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            )}
        </span>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 }
    }
};

function ExtractionResult({ prompt, file, extraction, onCopy, isCopied, onBack }: {
    prompt: string;
    file: any;
    extraction: string;
    onCopy: () => void;
    isCopied: boolean;
    onBack: () => void;
}) {
    // Attempt to parse JSON
    let data: ExtractionData | null = null;
    try {
        data = JSON.parse(extraction);
    } catch (e) {
        console.warn("Failed to parse AI response as JSON, falling back to raw text.");
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-6 py-16"
        >
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">Extraction Ready</h1>
                        <p className="text-xs text-white/40 font-mono tracking-wider uppercase">Vyana 3.0 Analysis</p>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">User Input</span>
                        {file && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20">
                                {file.mimeType.startsWith('image/') ? <ImageIcon className="w-3 h-3 text-[#00ff41]" /> : <FileText className="w-3 h-3 text-[#00ff41]" />}
                                <span className="text-[10px] font-bold text-[#00ff41]">{file.name}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-lg font-medium text-white/80 italic leading-relaxed">"{prompt || 'Analyze this file'}"</p>
                </div>
            </header>

            <motion.div
                className="space-y-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {data ? (
                    <>
                        {/* Summary Section */}
                        <motion.section variants={itemVariants}>
                            <SectionHeader icon={<Search className="w-4 h-4" />} title="Executive Summary" />
                            <div className="relative p-8 rounded-3xl bg-accent/5 border border-accent/10 shadow-xl overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles className="w-12 h-12 text-accent" />
                                </div>
                                <div className="text-xl font-medium text-white/90 leading-relaxed relative z-10 min-h-[4rem]">
                                    <TypewriterText text={data.summary} speed={4} />
                                </div>
                            </div>
                        </motion.section>

                        {/* Insights Grid */}
                        {data.insights && data.insights.length > 0 && (
                            <motion.section variants={itemVariants}>
                                <SectionHeader icon={<Zap className="w-4 h-4" />} title="Key Insights" />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.insights.map((insight, i) => (
                                        <motion.div
                                            key={i}
                                            variants={itemVariants}
                                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/30 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                                                    <DynamicIcon name={insight.icon} className="w-4 h-4" />
                                                </div>
                                                <h4 className="font-bold text-white uppercase tracking-wider text-xs">{insight.title}</h4>
                                            </div>
                                            <p className="text-sm text-white/50 leading-relaxed">{insight.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Flow / Graphics Section */}
                        {data.flow && data.flow.length > 0 && (
                            <motion.section variants={itemVariants}>
                                <SectionHeader icon={<Terminal className="w-4 h-4" />} title="Visual Process Flow" />
                                <div className="relative space-y-4">
                                    {data.flow.map((step, i) => (
                                        <motion.div key={i} variants={itemVariants} className="relative flex gap-6 items-start">
                                            {i < data.flow.length - 1 && (
                                                <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-accent/30 to-transparent" />
                                            )}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent text-black flex items-center justify-center font-black text-sm shadow-[0_0_20px_rgba(0,255,65,0.4)] relative z-10">
                                                {step.step}
                                            </div>
                                            <div className="flex-1 pb-8">
                                                <div className="p-6 rounded-3xl bg-[#080808] border border-white/5 shadow-2xl hover:border-accent/20 transition-all group">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <DynamicIcon name={step.icon} className="w-4 h-4 text-accent" />
                                                        <h4 className="text-lg font-bold text-white">{step.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Full Analysis Dropdown */}
                        <motion.section variants={itemVariants}>
                            <div className="flex items-center gap-4 mb-6">
                                <SectionHeader icon={<FileText className="w-4 h-4" />} title="Detailed Analysis" />
                                <button
                                    onClick={onCopy}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-accent/40 bg-white/5 transition-colors"
                                >
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                                    <span className="text-[10px] font-bold text-white/60">{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                            <div className="p-8 rounded-3xl bg-[#030303] border border-white/[0.08] text-white/70 leading-relaxed whitespace-pre-wrap font-sans text-base min-h-[10rem]">
                                <TypewriterText text={data.raw_analysis || extraction} speed={2} delay={1000} />
                            </div>
                        </motion.section>
                    </>
                ) : (
                    /* Fallback for raw text */
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center gap-4 mb-6">
                            <SectionHeader icon={<Sparkles className="w-4 h-4" />} title="Analysis Result" />
                            <button
                                onClick={onCopy}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-accent/40 bg-white/5 transition-colors"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                                <span className="text-[10px] font-bold text-white/60">{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                        <div className="p-8 rounded-3xl bg-[#030303] border border-white/[0.08] shadow-2xl min-h-[10rem]">
                            <div className="flex gap-4">
                                <span className="text-accent/30 font-mono text-sm select-none shrink-0">{'>'}</span>
                                <div className="text-white/80 leading-[1.8] whitespace-pre-wrap font-sans text-base">
                                    <TypewriterText text={extraction} speed={2} />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </motion.div>

            <footer className="mt-20 pt-12 border-t border-white/5 text-center">
                <button
                    onClick={onBack}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    New Analysis
                </button>
            </footer>
        </motion.div>
    )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
        </div>
    )
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const icons: Record<string, any> = {
        Zap, Database, Shield, Cpu, Layers, Target, TrendingUp, Search, FileText, ZapIcon: Zap,
        Checklist: Check, Process: Terminal, Hierarchy: Layers
    }
    const IconComponent = icons[name] || Sparkles
    return <IconComponent className={className} />
}
