'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function CookiesPage() {
    const lastUpdated = "February 22, 2026"

    const sections = [
        {
            title: 'Cookie Policy',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Vybex AI uses cookies to:</p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
                        <li>Maintain login sessions</li>
                        <li>Improve user experience</li>
                        <li>Monitor platform performance</li>
                    </ul>
                    <div className="pt-4 space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">
                            You may disable cookies in your browser settings.
                        </p>
                        <p className="text-xs text-zinc-500 italic">
                            Some features may not function properly without cookies.
                        </p>
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
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">Cookie Policy</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-lg font-bold tracking-tight text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <span>🍪</span> {section.title}
                            </h2>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
