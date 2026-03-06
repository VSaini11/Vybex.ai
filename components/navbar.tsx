'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#footer' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })

        // Check auth status
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user)
            })
            .catch(() => { })

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <nav
                    className="max-w-5xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300"
                    style={{
                        background: scrolled
                            ? 'rgba(10,10,10,0.85)'
                            : 'rgba(10,10,10,0.5)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: scrolled
                            ? '1px solid rgba(255,255,255,0.08)'
                            : '1px solid rgba(255,255,255,0.04)',
                        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
                    }}
                >
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2.5 group">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                            style={{ background: '#00ff41', boxShadow: '0 0 12px rgba(0,255,65,0.4)' }}
                        >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-foreground text-base tracking-tight">
                            Vybex<span className="text-accent">.ai</span>
                        </span>
                    </a>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <a
                                href="/dashboard"
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-background transition-all duration-200 hover:scale-105 flex items-center gap-2"
                                style={{ background: '#00ff41', boxShadow: '0 0 18px rgba(0,255,65,0.25)' }}
                            >
                                Dashboard
                            </a>
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                                >
                                    Sign in
                                </a>
                                <a
                                    href="/signup"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-background transition-all duration-200 hover:scale-105"
                                    style={{ background: '#00ff41', boxShadow: '0 0 18px rgba(0,255,65,0.25)' }}
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl overflow-hidden"
                            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'rgba(10,10,10,0.95)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <div className="flex flex-col p-4 gap-1">
                                {NAV_LINKS.map(link => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="h-px bg-border/30 my-2" />
                                {user ? (
                                    <a
                                        href="/dashboard"
                                        className="mt-1 px-4 py-3 rounded-xl text-sm font-semibold text-background text-center transition-all"
                                        style={{ background: '#00ff41' }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </a>
                                ) : (
                                    <>
                                        <a
                                            href="/login"
                                            className="px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Sign in
                                        </a>
                                        <a
                                            href="/signup"
                                            className="mt-1 px-4 py-3 rounded-xl text-sm font-semibold text-background text-center transition-all"
                                            style={{ background: '#00ff41' }}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Get Started
                                        </a>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    )
}
