'use client'

import { useState, useMemo } from 'react'
import { Eye, Code2, RefreshCw } from 'lucide-react'

interface PreviewPanelProps {
    pageContent: string | undefined
}

export default function PreviewPanel({ pageContent }: PreviewPanelProps) {
    const [mode, setMode] = useState<'preview' | 'code'>('preview')

    const iframeSrcdoc = useMemo(() => {
        if (!pageContent) return ''

        // Build a simple HTML "preview" by extracting JSX structure hints
        // For MVP: render a styled page that represents the generated design
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview – Vybex AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: { accent: '#00ff41' }
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #fff; font-family: system-ui, sans-serif; }
    .glow { box-shadow: 0 0 60px rgba(0,255,65,0.15); }
  </style>
</head>
<body class="dark">
  <main style="min-height:100vh; background:#0a0a0a; color:white; position:relative; overflow:hidden;">
    <!-- Background glows -->
    <div style="position:absolute;top:20%;left:20%;width:400px;height:400px;background:rgba(0,255,65,0.06);border-radius:50%;filter:blur(80px);pointer-events:none;"></div>
    <div style="position:absolute;bottom:20%;right:20%;width:300px;height:300px;background:rgba(0,255,65,0.04);border-radius:50%;filter:blur(60px);pointer-events:none;"></div>

    <!-- Hero -->
    <section style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center;position:relative;z-index:1;">
      <span style="display:inline-block;padding:6px 16px;margin-bottom:24px;font-size:11px;font-weight:700;letter-spacing:0.15em;color:#00ff41;border:1px solid rgba(0,255,65,0.3);border-radius:999px;background:rgba(0,255,65,0.05);">
        POWERED BY AI
      </span>
      <h1 style="font-size:clamp(2.5rem,8vw,5rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem;letter-spacing:-0.02em;">
        Your Amazing<br/>
        <span style="color:#00ff41;">Product</span>
      </h1>
      <p style="font-size:1.125rem;color:#999;max-width:500px;margin-bottom:2.5rem;line-height:1.7;">
        The next generation platform that transforms how you work, built with cutting-edge AI technology.
      </p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
        <button style="display:flex;align-items:center;gap:8px;padding:14px 32px;border-radius:12px;background:#00ff41;color:#0a0a0a;font-weight:700;font-size:15px;border:none;cursor:pointer;">
          Get Started Free →
        </button>
        <button style="display:flex;align-items:center;gap:8px;padding:14px 32px;border-radius:12px;background:transparent;color:white;font-weight:600;font-size:15px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;">
          View Demo
        </button>
      </div>
    </section>

    <!-- Features -->
    <section style="padding:5rem 2rem;position:relative;z-index:1;">
      <h2 style="text-align:center;font-size:2.5rem;font-weight:800;margin-bottom:3rem;">
        Why <span style="color:#00ff41;">Choose Us</span>
      </h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;max-width:900px;margin:0 auto;">
        ${['⚡ Lightning Fast|Blazing performance powered by the latest tech stack.', '🛡️ Secure by Default|Enterprise-grade security baked in from day one.', '📊 Data Driven|Real-time analytics and insights at your fingertips.'].map(item => {
            const [icon_title, desc] = item.split('|')
            const [icon, ...titleParts] = icon_title.split(' ')
            return `
        <div style="padding:1.5rem;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:border-color 0.3s;">
          <div style="font-size:2rem;margin-bottom:1rem;">${icon}</div>
          <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem;">${titleParts.join(' ')}</h3>
          <p style="font-size:0.875rem;color:#999;line-height:1.6;">${desc}</p>
        </div>`
        }).join('')}
      </div>
    </section>
  </main>
</body>
</html>`
    }, [pageContent])

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toggle header */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-border/60 flex-shrink-0">
                <div className="flex items-center gap-1 bg-background/60 border border-border/60 rounded-xl p-1">
                    <button
                        onClick={() => setMode('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${mode === 'preview'
                                ? 'bg-accent text-black shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                    </button>
                    <button
                        onClick={() => setMode('code')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${mode === 'code'
                                ? 'bg-accent text-black shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Code2 className="w-3.5 h-3.5" />
                        Code
                    </button>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={() => {
                            const iframe = document.querySelector('#preview-iframe') as HTMLIFrameElement
                            if (iframe) iframe.src = iframe.src
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150"
                        title="Refresh preview"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {mode === 'preview' ? (
                    <iframe
                        id="preview-iframe"
                        srcDoc={iframeSrcdoc}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0 bg-[#0a0a0a]"
                        title="Live Preview"
                    />
                ) : (
                    <pre className="w-full h-full overflow-auto p-4 text-xs font-mono text-green-400/80 bg-[#0d0d0d] leading-relaxed whitespace-pre-wrap break-words">
                        {pageContent ?? '// No file selected'}
                    </pre>
                )}
            </div>
        </div>
    )
}
