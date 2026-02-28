import React from 'react'

export default function JsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Vybex.ai',
        'operatingSystem': 'Web',
        'applicationCategory': 'BusinessApplication',
        'offers': {
            '@type': 'Offer',
            'price': '1.00',
            'priceCurrency': 'INR',
        },
        'description': 'AI-powered landing page generator that builds conversion-ready Next.js + Tailwind landing pages in minutes.',
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '1250',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Vybex.ai',
            'url': 'https://vybex.ai',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
