'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'
import { ArrowRight } from 'lucide-react'

export default function DocsContent() {
    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            content: (
                <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                        <span><strong>What is Vybex AI?</strong> An AI-powered engine that transforms your natural language prompts into high-performance landing pages.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                        <span><strong>How it works:</strong> Prompt → Generate → Preview → Download ZIP. It&apos;s a fast and simple workflow.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                        <span><strong>Starter vs Pro:</strong> Start with the Starter plan (₹1), or upgrade for unlimited generations and priority support.</span>
                    </li>
                </ul>
            )
        },
        {
            id: 'how-to-generate',
            title: 'How to Generate a Landing Page',
            content: (
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Step-by-step:</p>
                    <ol className="space-y-3 text-sm">
                        {[
                            'Sign up / Login to your Vybex account.',
                            'Enter a descriptive prompt in the editor.',
                            'Click the "Generate" button.',
                            'Preview and make edits if needed.',
                            'Download the complete ZIP folder.'
                        ].map((step, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className="text-accent font-bold">{i + 1}.</span>
                                <span className="text-muted-foreground">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )
        },
        {
            id: 'prompt-guide',
            title: 'Prompt Writing Guide',
            content: (
                <div className="space-y-5">
                    <p className="text-muted-foreground text-sm">Detailed prompts result in better landing pages.</p>

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Good prompt:</p>
                        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-xs italic text-muted-foreground">
                            &quot;Build a SaaS landing page for a productivity app with dark theme, hero section, pricing cards and testimonials.&quot;
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Bad prompt:</p>
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-xs italic text-muted-foreground">
                            &quot;Make website.&quot;
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'plans-limits',
            title: 'Plans & Limits',
            content: (
                <ul className="space-y-2 max-w-sm">
                    {[
                        { label: 'Starter', value: '7 pages/month' },
                        { label: 'Pro', value: '100 generations/month' },
                        { label: 'Pro+', value: '300 generations/month' }
                    ].map((plan, i) => (
                        <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-accent/30 transition-colors">
                            <span className="text-sm font-bold text-foreground">{plan.label}</span>
                            <span className="text-muted-foreground font-mono text-[11px]">{plan.value}</span>
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: 'faq',
            title: 'FAQ Section',
            content: (
                <div className="space-y-5">
                    {[
                        { q: 'Why is my generation slow?', a: 'High demand can take a moment. Pro users get priority access.' },
                        { q: 'What if it fails?', a: 'Check your connection or try a simpler prompt.' },
                        { q: 'Can I regenerate?', a: 'Yes, as many times as your plan allows.' },
                        { q: 'Do I own the code?', a: 'Yes. Once downloaded, the code is yours.' },
                        { q: 'Is there watermark?', a: 'Only on Starter and non-Pro plans.' }
                    ].map((faq, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-sm font-bold text-foreground">Q: {faq.q}</p>
                            <p className="text-xs text-muted-foreground pl-4 border-l border-white/10">{faq.a}</p>
                        </div>
                    ))}
                </div>
            )
        }
    ]

    return (
        <main className="bg-background text-foreground min-h-screen">
            <Navbar />

            {/* Header */}
            <header className="pt-28 pb-12 border-b border-border/40">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">Documentation</h1>
                        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Everything you need to know about building with Vybex AI. Clean and simple.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Docs Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-10">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                id={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                viewport={{ once: true, margin: '-20px' }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-lg font-bold tracking-tight text-white">{section.title}</h2>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>

                                <div>
                                    {section.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-20 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h3 className="text-base font-bold mb-1">Ready to ship?</h3>
                            <p className="text-muted-foreground text-xs">Start building your first page today.</p>
                        </div>
                        <a
                            href="/"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-bold text-xs hover:scale-105 transition-transform"
                        >
                            Get Started <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </motion.div>
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
