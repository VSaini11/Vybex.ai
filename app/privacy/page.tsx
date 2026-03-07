'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'

export default function PrivacyPage() {
    const lastUpdated = "February 22, 2026"

    const sections = [
        {
            title: '1. Introduction',
            content: 'Vybex AI (“we”, “our”, “us”) operates the website vybex.ai. This Privacy Policy explains how we collect, use, and protect your information when you use our services. By using Vybex AI, you agree to this Privacy Policy.'
        },
        {
            title: '2. Information We Collect',
            content: (
                <div className="space-y-4">
                    <div>
                        <p className="font-bold text-foreground mb-1">Account Information</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Login credentials</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-foreground mb-1">Usage Information</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Prompts submitted</li>
                            <li>Pages generated</li>
                            <li>Plan limits and usage statistics</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-foreground mb-1">Payment Information</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Payments are securely processed via Razorpay. We do not store your card details.
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-foreground mb-1">Technical Data</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Device information</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            title: '3. How We Use Your Information',
            content: (
                <div className="space-y-2">
                    <p className="text-muted-foreground">We use your data to:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Provide AI landing page generation</li>
                        <li>Manage user accounts</li>
                        <li>Process payments</li>
                        <li>Improve product performance</li>
                        <li>Prevent abuse and fraud</li>
                    </ul>
                </div>
            )
        },
        {
            title: '4. Third-Party Services',
            content: (
                <div className="space-y-2">
                    <p className="text-muted-foreground">We use trusted third-party providers:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>OpenAI (AI processing)</li>
                        <li>Razorpay (payments)</li>
                        <li>Vercel (hosting)</li>
                    </ul>
                    <p className="text-xs text-zinc-500 italic mt-2">These providers may process data according to their own policies.</p>
                </div>
            )
        },
        {
            title: '5. Data Security',
            content: 'We implement reasonable security measures to protect your information. However, no system is completely secure.'
        },
        {
            title: '6. Your Rights',
            content: (
                <div className="space-y-4 text-muted-foreground text-sm">
                    <p>You may:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Request account deletion</li>
                        <li>Request access to your stored data</li>
                        <li>Cancel your subscription anytime</li>
                    </ul>
                    <p className="font-bold text-foreground">Contact: vybex.signal@gmail.com</p>
                </div>
            )
        },
        {
            title: '7. Changes to Policy',
            content: 'We may update this Privacy Policy from time to time. Continued use means acceptance of updates.'
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
                        <h1 className="text-2xl font-black tracking-tight uppercase mb-4 italic">Privacy Policy</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Last Updated: {lastUpdated}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Policy Content */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                viewport={{ once: true, margin: '-20px' }}
                            >
                                <h2 className="text-lg font-bold tracking-tight text-white mb-4">{section.title}</h2>
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
