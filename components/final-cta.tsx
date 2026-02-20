'use client'

import { motion } from 'framer-motion'

const LINKS = {
  PRODUCT: [
    { label: 'AI Builder', href: '#' },
    { label: 'Pricing', href: '#' },
  ],
  COMPANY: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  RESOURCES: [
    { label: 'Documentation', href: '#' },
    { label: 'Community', href: '#' },
  ],
  LEGAL: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'License', href: '#' },
  ],
}

export default function FinalCTA() {
  return (
    <footer className="border-t border-border/40 bg-background">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — brand col */}
          <motion.div
            className="lg:col-span-1 flex flex-col gap-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">Vybex AI</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Vybex AI empowers founders and builders to ship conversion-ready landing pages in minutes.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                className="px-5 py-2.5 rounded-lg bg-accent text-background text-sm font-semibold hover:bg-accent/90 transition-all duration-200 text-left"
                style={{ boxShadow: '0 0 20px rgba(0,255,65,0.2)' }}
              >
                Get Started Free
              </button>
              <button className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-semibold hover:border-accent/40 hover:text-foreground transition-all duration-200 text-left">
                Contact Us
              </button>
            </div>
          </motion.div>

          {/* Right — link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(LINKS).map(([section, links], si) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: si * 0.07 }}
                viewport={{ once: true }}
              >
                <p className="text-xs font-semibold tracking-widest text-muted-foreground/60 uppercase mb-5">
                  {section}
                </p>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
          <p>
            Built by <span className="text-muted-foreground font-medium">Vybex.ai</span>
            {' '}· Powered by <span className="text-accent font-medium">Vybex Studio</span>
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-muted-foreground transition-colors">Privacy</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-muted-foreground transition-colors">Terms</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-muted-foreground transition-colors">License</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
