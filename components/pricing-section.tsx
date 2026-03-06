'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Starter Plan',
    dot: '#00ff41',
    monthlyPrice: 1,
    yearlyPrice: 1,
    yearlyTotal: 12,
    featured: false,
    note: '',
    features: [
      '20 generations per month',
      'Max 20 generations per day',
      'Standard theme only',
      'Max 1,800 token output',
      'Watermark in footer',
      'Basic customization',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro – ₹699/month',
    subName: 'Launch Price',
    dot: '#3b82f6',
    monthlyPrice: 699,
    yearlyPrice: 559,
    yearlyTotal: 6708,
    featured: true,
    badge: 'Most popular',
    note: '100/month sounds generous but is safe.',
    features: [
      '100 generations per month',
      'Full-length output',
      'No watermark',
      'Theme variations',
      'Faster generation',
      'Priority queue',
    ],
  },
  {
    id: 'proplus',
    name: 'Pro+ - ₹1,499/month',
    subName: 'Later, not now',
    dot: '#a855f7',
    monthlyPrice: 1499,
    yearlyPrice: 0,
    yearlyTotal: 0,
    featured: false,
    comingSoon: true,
    note: 'Add only after traction.',
    features: [
      '300 generations/month',
      'Multi-language',
      'Tone presets',
      'Section editor',
    ],
  },
]

// Default stacked positions
const DEFAULT_TRANSFORMS = [
  { x: '-58%', rotate: -8, scale: 0.88, zIndex: 1, y: '4%' },
  { x: '0%', rotate: 0, scale: 1, zIndex: 10, y: '0%' },
  { x: '58%', rotate: 8, scale: 0.88, zIndex: 1, y: '4%' },
]

// Where each card goes when IT is hovered
const HOVERED_TRANSFORMS = [
  { x: '-80%', rotate: 0, scale: 1, zIndex: 20, y: '0%' }, // left comes out
  { x: '0%', rotate: 0, scale: 1.03, zIndex: 20, y: '-2%' }, // center lifts
  { x: '80%', rotate: 0, scale: 1, zIndex: 20, y: '0%' }, // right comes out
]

function getTransform(i: number, hoveredCard: number | null) {
  if (hoveredCard === i) return HOVERED_TRANSFORMS[i]
  return DEFAULT_TRANSFORMS[i]
}

export default function PricingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="pricing" className="py-28 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Pricing plan</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Simple, transparent pricing. Start free, scale when you&apos;re ready.
          </p>
        </motion.div>


        {/* Stacked / fanned card area */}
        <div className="relative">
          {/* Mobile View: Standard Stack */}
          <div className="flex flex-col gap-6 md:hidden">
            {PLANS.map((plan) => {
              const price = plan.monthlyPrice
              return (
                <div
                  key={plan.id}
                  className="w-full rounded-3xl p-7 flex flex-col gap-5"
                  style={{
                    background: plan.featured
                      ? 'linear-gradient(145deg, #0d2e14 0%, #0a0a0a 100%)'
                      : 'linear-gradient(145deg, #141414 0%, #0d0d0d 100%)',
                    border: plan.featured ? '1.5px solid rgba(0,255,65,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                    boxShadow: plan.featured
                      ? '0 0 60px rgba(0,255,65,0.12), 0 30px 60px rgba(0,0,0,0.5)'
                      : '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="flex justify-end">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-background">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name row with dot */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: plan.dot }} />
                    <div>
                      <span className="text-sm font-bold text-foreground">{plan.name}</span>
                      {plan.subName && (
                        <span className="ml-2 text-xs text-muted-foreground">({plan.subName})</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1 leading-none">
                    <span className="text-5xl font-extrabold text-foreground">
                      {price > 0 ? `₹ ${price.toLocaleString()}` : '—'}
                    </span>
                    {price > 0 && <span className="text-muted-foreground text-base mb-1">/mo</span>}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/40" />

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: plan.dot }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.note && <p className="text-xs text-muted-foreground/60 mt-4 italic">{plan.note}</p>}
                </div>
              )
            })}
          </div>

          {/* Desktop View: Fanned Stack */}
          <motion.div
            className="hidden md:flex justify-center relative"
            style={{ height: 420 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            {PLANS.map((plan, i) => {
              const t = getTransform(i, hoveredCard)
              const price = plan.monthlyPrice

              return (
                <motion.div
                  key={plan.id}
                  className="absolute w-72 rounded-3xl cursor-pointer select-none"
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  animate={{
                    x: t.x,
                    rotate: t.rotate,
                    scale: t.scale,
                    y: t.y,
                    zIndex: t.zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  style={{
                    top: 0,
                    left: '50%',
                    marginLeft: '-144px',
                    transformOrigin: 'bottom center',
                    zIndex: t.zIndex,
                  }}
                >
                  <div
                    className="relative w-full h-full rounded-3xl overflow-hidden p-7 flex flex-col gap-5"
                    style={{
                      background: plan.featured
                        ? 'linear-gradient(145deg, #0d2e14 0%, #0a0a0a 100%)'
                        : 'linear-gradient(145deg, #141414 0%, #0d0d0d 100%)',
                      border: plan.featured ? '1.5px solid rgba(0,255,65,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                      boxShadow: plan.featured
                        ? '0 0 60px rgba(0,255,65,0.12), 0 30px 60px rgba(0,0,0,0.5)'
                        : '0 20px 60px rgba(0,0,0,0.5)',
                      minHeight: 380,
                    }}
                  >
                    {plan.badge && (
                      <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full bg-accent text-background">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: plan.dot }} />
                      <div>
                        <span className="text-sm font-bold text-foreground">{plan.name}</span>
                        {plan.subName && (
                          <span className="ml-2 text-xs text-muted-foreground">({plan.subName})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end gap-1 leading-none">
                      <span className="text-5xl font-extrabold text-foreground">
                        {price > 0 ? `₹ ${price.toLocaleString()}` : '—'}
                      </span>
                      {price > 0 && <span className="text-muted-foreground text-base mb-1">/mo</span>}
                    </div>
                    <div className="h-px bg-border/40" />
                    <ul className="space-y-3 flex-grow">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: plan.dot }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.note && <p className="text-xs text-muted-foreground/60 mt-auto italic">{plan.note}</p>}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>


        {/* CTA below cards */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <button
            className="px-8 py-3 rounded-full bg-accent text-background font-semibold text-base hover:bg-accent/90 transition-all duration-200 hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(0,255,65,0.25)' }}
          >
            Get Started
          </button>
        </motion.div>

      </div>
    </section>
  )
}
