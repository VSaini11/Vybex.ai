'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function TermsPage() {
    const lastUpdated = "February 22, 2026"

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using Vybex AI, you agree to these Terms of Service.'
        },
        {
            title: '2. User Accounts',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">You are responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Maintaining account security</li>
                        <li>All activity under your account</li>
                    </ul>
                    <p className="text-sm text-zinc-500">We reserve the right to suspend accounts that violate these terms.</p>
                </div>
            )
        },
        {
            title: '3. Usage Limits',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Plans include generation limits:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>Free Plan:</strong> Limited monthly generations</li>
                        <li><strong>Pro Plan:</strong> 100 generations/month</li>
                        <li><strong>Pro+ Plan:</strong> 300 generations/month</li>
                    </ul>
                    <p className="text-xs text-zinc-500 italic">Exceeding limits may restrict access until renewal.</p>
                </div>
            )
        },
        {
            title: '4. Acceptable Use',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Users may not:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Abuse the AI system</li>
                        <li>Attempt to exploit token limits</li>
                        <li>Generate harmful, illegal, or malicious content</li>
                        <li>Reverse-engineer the service</li>
                    </ul>
                    <p className="text-sm font-bold text-red-500/80">Violation may result in account termination.</p>
                </div>
            )
        },
        {
            title: '5. AI Output Disclaimer',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Vybex AI generates content using artificial intelligence.</p>
                    <div className="space-y-2">
                        <p className="font-bold text-foreground">We do not guarantee:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Accuracy</li>
                            <li>Completeness</li>
                            <li>Production-readiness</li>
                        </ul>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed italic border-l border-white/10 pl-4">
                        Users are responsible for reviewing and validating generated code before deployment.
                    </p>
                </div>
            )
        },
        {
            title: '6. Payments & Billing',
            content: (
                <div className="space-y-4 text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Subscriptions are billed monthly.</li>
                        <li>Payments are processed securely via Razorpay.</li>
                        <li>No refunds unless legally required.</li>
                        <li>You may cancel anytime.</li>
                    </ul>
                </div>
            )
        },
        {
            title: '7. Limitation of Liability',
            content: (
                <div className="space-y-2">
                    <p className="text-muted-foreground italic">&quot;Vybex AI is provided as is.&quot;</p>
                    <p className="text-muted-foreground">We are not liable for damages arising from use of generated content.</p>
                </div>
            )
        },
        {
            title: '8. Termination',
            content: 'We reserve the right to suspend or terminate accounts that violate these terms.'
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
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">Terms of Service</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Terms Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                viewport={{ once: true, margin: '-20px' }}
                            >
                                <h2 className="text-lg font-bold tracking-tight text-white mb-4">{section.title}</h2>
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    {section.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
