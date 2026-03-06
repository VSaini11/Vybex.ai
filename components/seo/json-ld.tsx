import React from 'react'

export default function JsonLd() {
    const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Vybex AI',
        'alternateName': ['Vybex', 'Vybex AI Builder'],
        'url': 'https://vybexai.vercel.app/',
    }

    const softwareData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Vybex AI',
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
            'name': 'Vybex AI',
            'url': 'https://vybexai.vercel.app/',
            'logo': 'https://vybexai.vercel.app/icon.png',
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
            />
        </>
    )
}
