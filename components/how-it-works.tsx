'use client'

import { motion } from 'framer-motion'
import { Zap, Code2, Rocket } from 'lucide-react'

const steps = [
  {
    icon: Zap,
    title: 'Describe Your Vision',
    description: 'Tell Vybex.ai about your product or service in plain English.',
  },
  {
    icon: Code2,
    title: 'AI Generates Code',
    description: 'Advanced AI structures and generates conversion-optimized landing pages.',
  },
  {
    icon: Rocket,
    title: 'Deploy Instantly',
    description: 'Get production-ready Next.js code ready to deploy in seconds.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Simple, fast, and powerful</p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                {/* Glassmorphism card */}
                <div className="h-full p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 group-hover:bg-card/70">
                  {/* Step number */}
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-accent text-background rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Connection line - hidden on last item */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent/50 to-transparent"></div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
