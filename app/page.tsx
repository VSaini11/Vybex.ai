'use client'

import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import DemoPreview from '@/components/demo-preview'
import PricingSection from '@/components/pricing-section'
import FinalCTA from '@/components/final-cta'

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <DemoPreview />
      <PricingSection />
      <FinalCTA />
    </main>
  )
}


