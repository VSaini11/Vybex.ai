import type { Metadata } from 'next'
import DocsContent from '@/components/docs/docs-content'

export const metadata: Metadata = {
    title: 'Documentation - Vybex.ai',
    description: 'Learn how to use Vybex AI to build your landing pages. Step-by-step guides, prompt writing tips, and FAQs.',
}

export default function DocsPage() {
    return <DocsContent />
}
