'use client'

import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────
// ADD YOUR IMAGES HERE — as many or as few as you like.
// They will cycle across all 15 background slots automatically.
// Example: '/screenshots/site-1.png', '/screenshots/site-2.png'
// ─────────────────────────────────────────────────────────────
const IMAGES: string[] = [
  '/Img1.png',
  '/Img2.png',
  '/Img3.png',
  '/Img4.png',
  // '/your-second-image.png',
  // '/your-third-image.png',
]

// 3 rows × 5 columns = 15 slots
const ROWS: { offset: number; items: number[] }[] = [
  { offset: -40, items: [0, 1, 2, 3, 4] },
  { offset: 0, items: [5, 6, 7, 8, 9] },
  { offset: -20, items: [10, 11, 12, 13, 14] },
]

const CARD_W = 420
const CARD_H = 260
const GAP = 20

export default function DemoPreview() {
  return (
    <section className="relative py-72 px-4 overflow-hidden">

      {/* ── Tilted diagonal image mosaic background ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

        {/* Perspective wrapper — tilts the whole grid backwards + slight diagonal */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center"
          style={{
            perspective: '1400px',
          }}
        >
          <div
            style={{
              transform: 'rotateX(14deg) rotateZ(-4deg) scale(1.35)',
              transformOrigin: 'center 40%',
              display: 'flex',
              flexDirection: 'column',
              gap: GAP,
              width: '100%',
              position: 'absolute',
              top: '8%',
            }}
          >
            {ROWS.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: 'flex',
                  gap: GAP,
                  marginLeft: row.offset,
                  // stagger rows horizontally for the diagonal feel
                  paddingLeft: ri * 60,
                }}
              >
                {row.items.map((n) => (
                  <motion.div
                    key={n}
                    className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a1a1a]"
                    style={{ width: CARD_W, height: CARD_H }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: (ri * 5 + (n % 5)) * 0.05 }}
                  >
                    <img
                      src={IMAGES[n % IMAGES.length]}
                      alt={`Vybex AI generated landing page preview ${n + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Fades — top heavy, bottom strong */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, var(--background) 0%, var(--background) 30%, transparent 55%, transparent 65%, var(--background) 100%)',
          }}
        />
        {/* Side fades */}
        <div className="absolute inset-y-0 left-0 w-48 z-10"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-48 z-10"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />
      </div>

      {/* ── Foreground content ── */}
      <div className="relative z-20 max-w-6xl mx-auto" />
    </section>
  )
}

