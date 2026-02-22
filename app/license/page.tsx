'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function LicensePage() {
    const lastUpdated = "February 22, 2026"

    const sections = [
        {
            title: 'Ownership of Generated Content',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm font-medium">
                        Users retain ownership of landing pages generated using Vybex AI.
                    </p>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">You are free to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                            <li>Modify</li>
                            <li>Publish</li>
                            <li>Commercialize</li>
                            <li>Deploy generated code</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            title: 'Platform Rights',
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm font-medium">
                        Vybex AI retains the right to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        <li>Improve the system using anonymized usage data</li>
                        <li>Prevent abuse or misuse</li>
                    </ul>
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
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">License</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="space-y-16">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-lg font-bold tracking-tight text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                    <span>📜</span> {section.title}
                                </h2>
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
