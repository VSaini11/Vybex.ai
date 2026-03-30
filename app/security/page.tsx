'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function SecurityPage() {
    const lastUpdated = "March 30, 2026"

    const sections = [
        {
            title: 'Reporting a Vulnerability',
            content: (
                <div className="space-y-4">
                    <p>If you discover any security vulnerability, please report it to us at:</p>
                    <p className="font-bold text-accent">📧 vybex.signal@gmail.com</p>
                    <p>Please include:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>A clear description of the issue</li>
                        <li>Steps to reproduce the vulnerability</li>
                        <li>Any relevant screenshots or proof-of-concept</li>
                        <li>Your contact details</li>
                    </ul>
                    <p>We aim to respond to valid reports within 48–72 hours.</p>
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
            title: 'Guidelines',
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
            title: 'Our Commitment',
            content: (
                <div className="space-y-2">
                    <p>If you follow these guidelines:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>We will acknowledge your report</li>
                        <li>We will investigate and fix valid issues promptly</li>
                        <li>We will not take legal action against responsible researchers</li>
                    </ul>
                </div>
            )
        },
        {
            title: 'Bug Bounty',
            content: (
                <div className="space-y-4">
                    <p>Currently, Vybex does not offer a formal bug bounty program.</p>
                    <p>However, we truly appreciate responsible disclosures and may acknowledge valid contributions.</p>
                </div>
            )
        },
        {
            title: 'Safe Harbor',
            content: (
                <p>We consider activities conducted under this policy as authorized, provided they comply with the guidelines mentioned above.</p>
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
                        <div className="flex items-center gap-3 mb-6">
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
                        <h1 className="text-3xl font-black tracking-tight uppercase mb-4 italic text-white">Security & Responsible Disclosure</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                        <p className="mt-8 text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-6 max-w-2xl">
                            At Vybex, we take the security of our platform and users seriously. We appreciate the efforts of security researchers and the community in helping us identify and address vulnerabilities responsibly.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Policy Content */}
            <section className="py-16 pb-24">
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
                    
                    <motion.div 
                        className="mt-16 pt-8 border-t border-border/20 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-sm text-muted-foreground">
                            Thank you for helping us keep Vybex secure 🙌
                        </p>
                    </motion.div>
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
