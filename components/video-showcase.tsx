'use client'

import { motion } from 'framer-motion'

export default function VideoShowcase() {
    return (
        <section className="relative pt-0 pb-24 px-4 overflow-hidden bg-background">
            <div className="max-w-4xl mx-auto relative group">

                {/* Main Video Container with Smooth Fade Frame and Masking */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                    }}
                >
                    <div className="aspect-video relative">
                        {/* The Video */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"

                        >
                            <source src="/animation.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Additional Edge Fades for extreme smoothness */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `
                                    linear-gradient(to right, var(--background) 0%, transparent 15%, transparent 85%, var(--background) 100%),
                                    linear-gradient(to bottom, var(--background) 0%, transparent 15%, transparent 85%, var(--background) 100%)
                                `
                            }}
                        />

                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none" />
                    </div>
                </div>

                {/* Caption/Subtext */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Powerful AI. <span className="text-accent">Seamless Experience.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Experience the future of landing page creation with our intuitive AI-driven interface.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

