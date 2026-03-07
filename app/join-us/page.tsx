'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'
import { ArrowRight, Zap, Globe, Cpu, Sparkles } from 'lucide-react'

export default function JoinUsPage() {
    return (
        <main className="bg-background text-foreground min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-0 -ml-20 -mt-20 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Shape the <span className="text-accent">Future</span> of <br />
                            <span className="bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">AI Interfaces.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                            At Vybex, we don't just build tools. We design experiences that redefine how people interact with intelligence. Join a team of visionaries obsessed with speed, aesthetics, and impact.
                        </p>

                        <motion.a
                            href="mailto:vybex.signal@gmail.com"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-all duration-200 hover:scale-105"
                            whileHover={{ gap: '12px' }}
                        >
                            Drop your Portfolio <ArrowRight className="w-5 h-5" />
                        </motion.a>
                    </motion.div>
                </div>
            </section>



            {/* Recruitment Banner */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-accent/20 to-purple-500/20 border border-white/10 p-12 md:p-20 overflow-hidden text-center">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's build something <br />unforgettable together.</h2>
                            <p className="text-lg text-muted-foreground/80 mb-10 max-w-xl mx-auto">
                                We are always looking for talented designers, developers, and AI researchers who want to do the best work of their lives.
                            </p>
                            <a
                                href="mailto:vybex.signal@gmail.com"
                                className="text-2xl font-bold text-foreground hover:text-accent transition-colors"
                            >
                                vybex.signal@gmail.com ↗
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <FinalCTA />
        </main>
    )
}
