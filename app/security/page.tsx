'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function SecurityPage() {
    const lastUpdated = "March 30, 2026"

    const sections = [
        {
            title: 'Reporting',
            content: (
                <div className="space-y-4">
                    <p>If you discover any security vulnerability, please report it to us at:</p>
                    <p className="font-bold text-accent">📧 vybex.signal@gmail.com</p>
                    <p className="font-bold text-white mb-2 underline underline-offset-4 decoration-accent/30">What to include in your report:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Description of the vulnerability</li>
                        <li>Steps to reproduce</li>
                        <li>Screenshots or proof-of-concept (PoC)</li>
                        <li>Impact of the issue</li>
                    </ul>
                    <p className="pt-2 italic border-l-2 border-accent/20 pl-4">
                        We aim to respond within <span className="text-white font-medium">48–72 hours</span> and resolve issues as quickly as possible.
                    </p>
                </div>
            )
        },
        {
            title: 'Scope',
            content: (
                <div className="space-y-2">
                    <p>This policy applies to:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Vybex website and web applications</li>
                        <li>APIs and backend services</li>
                        <li>Authentication and user account systems</li>
                    </ul>
                </div>
            )
        },
        {
            title: 'Rules',
            content: (
                <div className="space-y-2">
                    <p>To ensure responsible disclosure, we ask that you:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Do not access, modify, or delete user data</li>
                        <li>Do not exploit vulnerabilities beyond proof-of-concept</li>
                        <li>Do not perform DDoS or brute-force attacks</li>
                        <li>Do not disrupt services or harm users</li>
                        <li>Respect user privacy at all times</li>
                    </ul>
                </div>
            )
        },
        {
            title: 'Commitment',
            content: (
                <div className="space-y-2">
                    <p>If you follow these guidelines:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>We will acknowledge your report</li>
                        <li>We will investigate and fix valid issues promptly</li>
                        <li>We will not take legal action for good faith research</li>
                    </ul>
                </div>
            )
        },
        {
            title: 'Bounty',
            content: (
                <div className="space-y-4">
                    <p className="font-medium text-white italic">
                        We currently do not offer a paid bug bounty program.
                    </p>
                    <p>However, we truly appreciate responsible disclosures and may acknowledge valid contributions.</p>
                </div>
            )
        },
        {
            title: 'Safe Harbor',
            content: (
                <div className="space-y-4 bg-accent/5 p-6 rounded-xl border border-accent/10">
                    <p className="font-bold text-white mb-2">Legal Protection</p>
                    <p className="text-sm">
                        We will not take legal action against researchers who follow this policy in good faith. We consider activities conducted under this policy as authorized, provided they comply with the guidelines mentioned above.
                    </p>
                </div>
            )
        }
    ]

    return (
        <main className="bg-background text-foreground min-h-screen">
            <Navbar />

            {/* Header */}
            <header className="pt-28 pb-12 border-b border-border/40 text-center md:text-left">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                                className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent"
                            >
                                <Shield className="w-5 h-5" />
                            </motion.div>
                            <span className="text-xs font-bold tracking-widest text-accent uppercase">Security First</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4 italic text-white">Security & Responsible Disclosure</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                        <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed italic border-l-4 border-accent/20 pl-6 max-w-2xl text-left">
                            At Vybex, we take the security of our platform and users seriously. We appreciate the efforts of security researchers and the community in helping us identify and address vulnerabilities responsibly.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Policy Content */}
            <section className="py-20 pb-28">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-16">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                viewport={{ once: true, margin: '-20px' }}
                                className="relative"
                            >
                                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 to-transparent hidden md:block" />
                                <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
                                    <span className="text-accent/40 text-xs font-mono">0{idx + 1}</span>
                                    {section.title}
                                </h2>
                                <div className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {section.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <motion.div 
                        className="mt-24 pt-12 border-t border-border/20 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <span>Thank you for helping us keep Vybex secure</span>
                            <span className="animate-bounce">🙌</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
