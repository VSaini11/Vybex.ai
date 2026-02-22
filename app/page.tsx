'use client'

import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import VideoShowcase from '@/components/video-showcase'
import DemoPreview from '@/components/demo-preview'
import PricingSection from '@/components/pricing-section'
import FinalCTA from '@/components/final-cta'
import BuilderLayout from '@/components/builder/builder-layout'
import { useBuilder } from '@/hooks/use-builder'

export default function Home() {
  const {
    project,
    activeFilePath,
    openTabs,
    isLoading,
    status,
    error,
    generate,
    setActiveFile,
    closeTab,
    regenerate,
    downloadZip,
    reset,
  } = useBuilder()

  const showBuilder = isLoading || project !== null || error !== null

  return (
    <>
      {/* Landing page */}
      <main className="bg-background text-foreground">
        <Navbar />
        <HeroSection onGenerate={generate} />
        <VideoShowcase />
        <DemoPreview />
        <PricingSection />
        <FinalCTA />
      </main>


      {/* Builder overlay */}
      <AnimatePresence>
        {showBuilder && (
          <BuilderLayout
            project={project}
            activeFilePath={activeFilePath}
            openTabs={openTabs}
            isLoading={isLoading}
            status={status}
            error={error}
            onSelectFile={setActiveFile}
            onTabClick={setActiveFile}
            onTabClose={closeTab}
            onBack={reset}
            onRegenerate={regenerate}
            onDownloadZip={downloadZip}
          />
        )}
      </AnimatePresence>
    </>
  )
}
