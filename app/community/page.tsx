'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'
import { ArrowRight, Mail, Linkedin, Twitter, MessageSquare } from 'lucide-react'

export default function CommunityPage() {
    const sections = [
        {
            id: 'join-builders',
            title: 'Join the Builders',
            content: (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Short intro:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4">
                        Vybex AI is built for founders, developers and creators who ship fast.
                    </p>
                </div>
            )
        },
        {
            id: 'where-to-connect',
            title: 'Where to Connect',
            content: (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Add:</p>
                    <ul className="space-y-2 max-w-sm">
                        {[
                            { label: 'LinkedIn Page', icon: <Linkedin className="w-3.5 h-3.5" />, href: 'https://www.linkedin.com/company/vybex-studio' },
                            { label: 'Email Support', icon: <Mail className="w-3.5 h-3.5" />, href: 'mailto:hello@vybex.ai' },
                            { label: 'Discord Community', icon: <MessageSquare className="w-3.5 h-3.5" />, href: '#', note: '(Join early access)' },
                            { label: 'Twitter / X', icon: <Twitter className="w-3.5 h-3.5" />, href: '#' }
                        ].map((link, i) => (
                            <li key={i}>
                                <a
                                    href={link.href}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10 group hover:border-accent/30 hover:bg-white/[0.05] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground group-hover:text-accent transition-colors">{link.icon}</span>
                                        <span className="text-sm font-bold text-foreground">{link.label}</span>
                                    </div>
                                    {link.note && <span className="text-[10px] text-zinc-500 font-medium">{link.note}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'feature-requests',
            title: 'Feature Requests',
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Want a new feature?
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Drop your idea at</span>
                        <a
                            href="mailto:hello@vybex.ai"
                            className="text-sm font-bold text-accent hover:underline flex items-center gap-1"
                        >
                            hello@vybex.ai <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        </a>
                    </div>
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
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">Community</h1>
                        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Vybex AI is more about engagement. Join the fastest growing community of AI builders.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Community Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12">
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
                            <h3 className="text-base font-bold mb-1">Building something cool?</h3>
                            <p className="text-muted-foreground text-xs">Share your creations with the world.</p>
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
