'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const features = [
  {
    title: 'Conversion-Optimized',
    description: 'Built with proven conversion patterns and best practices from top-performing landing pages.',
  },
  {
    title: 'SEO Ready',
    description: 'Automatically optimized for search engines with proper meta tags, structured data, and performance.',
  },
  {
    title: 'Clean Tailwind Code',
    description: 'Production-ready code using Tailwind CSS for easy customization and maintenance.',
  },
  {
    title: 'Production-Ready',
    description: 'Deploy directly to Vercel or any hosting platform without additional configuration.',
  },
]

export default function WhyVybex() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-background to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Vybex.ai</h2>
          <p className="text-muted-foreground text-lg">Everything you need for landing page success</p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{ borderColor: 'hsl(var(--accent))' }}
            >
              <div className="flex gap-4">
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-accent mt-1" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
