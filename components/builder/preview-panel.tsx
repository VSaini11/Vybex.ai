'use client'

import { useState, useMemo } from 'react'
import { Eye, Code2, RefreshCw } from 'lucide-react'

interface PreviewPanelProps {
  pageContent: string | undefined
}

function buildPreviewHtml(pageContent: string): string {
  // Use JSON stringify to safely escape the code for a data attribute
  const safeJson = JSON.stringify(pageContent);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview – Vybex AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/framer-motion@11/dist/framer-motion.js"></script>
  <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { -webkit-font-smoothing: antialiased; background: #0a0a0a; color: white; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="error-display" style="display:none;padding:2rem;background:#1a0000;color:#ff4444;font-family:monospace;white-space:pre-wrap;font-size:13px;border-bottom:1px solid #400;"></div>
  
  <script id="page-source" type="application/json">
    ${safeJson}
  </script>

  <script type="text/babel" data-presets="typescript,react">
    (function() {
      try {
        const rawSource = JSON.parse(document.getElementById('page-source').textContent);
        
        // 1. Capture the default export name before stripping
        const defaultExportRegex = /export\\s+default\\s+(?:(?:function|class|const)\\s+)?(\\w+)?/;
        const defaultExportMatch = rawSource.match(defaultExportRegex);
        const capturedName = defaultExportMatch ? defaultExportMatch[1] : null;

        // 2. Strip imports and directives
        const moduleCode = rawSource
          .replace(/^(?:\\s*['"]?use client['"]?;?\\s*)+/gi, '')
          .replace(/^\\s*import\\b[\\s\\S]*?from\\s+['"].*?['"];?/gm, '')
          .replace(/^\\s*import\\s+['"].*?['"];?/gm, '')
          .replace(/export\\s+default\\s+/g, '/* export default */ ')
          .replace(/export\\s+(?!default)/g, '/* export */ ');

        const wrappedCode = \`
          const { useState, useEffect, useRef, useCallback, useMemo } = React;
          const { motion, AnimatePresence, useScroll, useTransform, useInView } = (window.FramerMotion || {});
          
          const LucideIcons = (window.LucideReact || {});
          Object.keys(LucideIcons).forEach(key => {
            if (typeof LucideIcons[key] === 'function' || typeof LucideIcons[key] === 'object') {
              window[key] = LucideIcons[key];
            }
          });

          \${moduleCode}

          const __captured = \${capturedName ? '"' + capturedName + '"' : 'null'};
          const __found = (typeof window[__captured] !== 'undefined' ? window[__captured] : null) 
            || (typeof Page !== 'undefined' ? Page : null)
            || (typeof Home !== 'undefined' ? Home : null)
            || (typeof LandingPage !== 'undefined' ? LandingPage : null)
            || (typeof App !== 'undefined' ? App : null)
            || (function() {
                 const candidates = Object.keys(window).filter(k => /^[A-Z]/.test(k) && typeof window[k] === 'function');
                 return window[candidates[0]] || null;
               })();

          if (__found) {
            ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(__found));
          } else {
            throw new Error('No component found to render. Ensure you have an "export default" or a "Page" component.');
          }
        \`;

        const transformed = Babel.transform(wrappedCode, { 
          presets: ['typescript', 'react'],
          filename: 'page.tsx' 
        }).code;
        
        eval(transformed);

      } catch (e) {
        const el = document.getElementById('error-display');
        el.style.display = 'block';
        el.textContent = 'Preview Error: ' + e.message;
      }
    })();
  </script>
</body>
</html>`
}

export default function PreviewPanel({ pageContent }: PreviewPanelProps) {
  const [mode, setMode] = useState<'preview' | 'code'>('preview')
  const [refreshKey, setRefreshKey] = useState(0)

  const iframeSrcdoc = useMemo(() => {
    if (!pageContent || pageContent.trim().length < 50) {
      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#555;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;font-size:14px;">
              <p>Generate a page to see the preview here.</p></body></html>`
    }
    return buildPreviewHtml(pageContent)
  }, [pageContent, refreshKey])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 px-4 py-3 border-b border-border/60 flex-shrink-0">
        <div className="flex items-center gap-1 bg-background/60 border border-border/60 rounded-xl p-1">
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 \${mode === 'preview'
              ? 'bg-accent text-black shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 \${mode === 'code'
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
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {mode === 'preview' ? (
          <iframe
            key={refreshKey}
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
