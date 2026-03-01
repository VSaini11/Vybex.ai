'use client'

import { useState, useMemo } from 'react'
import { Eye, Code2, RefreshCw } from 'lucide-react'

interface PreviewPanelProps {
  pageContent: string | undefined
}

function buildPreviewHtml(pageContent: string): string {
  const safeJson = JSON.stringify(pageContent);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview – Vybex AI</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <script>
    window.tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
            accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --background: 240 10% 3.9%; --foreground: 0 0% 98%;
      --primary: 0 0% 98%; --primary-foreground: 240 5.9% 10%;
      --accent: 240 3.7% 15.9%; --accent-foreground: 0 0% 98%;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      -webkit-font-smoothing: antialiased; 
      background-color: #0c0c0c; 
      color: white; 
      overflow-x: hidden; 
    }
    #root { min-height: 100vh; background: #0c0c0c; }
    #error-display { 
      padding: 1rem 2rem; 
      background: #1a0000; 
      color: #ff4444; 
      font-family: monospace; 
      white-space: pre-wrap; 
      font-size: 13px; 
      border-bottom: 2px solid #400;
      display: none;
      position: sticky;
      top: 0;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div id="error-display"></div>
  <div id="root"></div>
  
  <script id="page-source" type="application/json">${safeJson}</script>

  <script>
    (async function() {
      const el = document.getElementById('error-display');
      const showError = (msg) => { 
        if (msg.includes('forwardRef')) return; // Suppress Lucide initialization warning
        el.style.display = 'block'; 
        el.textContent = 'Preview Error: ' + msg; 
      };
      
      window.onerror = (msg, url, line) => { showError(msg + " (Line " + line + ")"); };

      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src; s.crossOrigin = "anonymous";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      try {
        await loadScript("https://unpkg.com/react@18/umd/react.development.js");
        await loadScript("https://unpkg.com/react-dom@18/umd/react-dom.development.js");
        
        // Brief pause to ensure React is fully settled globally before Lucide
        await new Promise(r => setTimeout(r, 50));
        
        await Promise.all([
          loadScript("https://unpkg.com/framer-motion@11/dist/framer-motion.js"),
          loadScript("https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js")
        ]);

        const rawSource = JSON.parse(document.getElementById('page-source').textContent);
        const Lucide = (window.LucideReact || window.Lucide || {});
        const Motion = (window.FramerMotion || window.Motion || {});
        const IconProxy = new Proxy(Lucide, {
          get: (target, prop) => target[prop] || (target.icons && target.icons[prop]) || (() => null)
        });

        // 1. Build mappings
        const importRegex = /import\\s+{[^}]+}\\s+from\\s+['"](lucide-react|framer-motion|react)['"]/g;
        let mappings = '';
        let match;
        while ((match = importRegex.exec(rawSource)) !== null) {
          const content = match[0];
          const library = match[1];
          const membersMatch = content.match(/{([^}]+)}/);
          if (membersMatch) {
            const members = membersMatch[1].split(',').map(m => m.trim());
            const libObj = library === 'lucide-react' ? 'IconProxy' : (library === 'framer-motion' ? 'Motion' : 'React');
            mappings += \`var { \${members.join(', ')} } = \${libObj};\\n\`;
          }
        }

        const componentName = (rawSource.match(/export\\s+default\\s+(?:(?:function|class|const)\\s+)?(\\w+)?/) || [])[1];

        // 2. Transform page code (Clean imports + Fix Next.js style tags + Escape math symbols)
        const moduleCode = rawSource
          .replace(/^(?:\\s*['"]?use client['"]?;?\\s*)+/gi, '')
          .replace(/^\\s*import\\b[\\s\\S]*?from\\s+['"].*?['"];?/gm, '')
          .replace(/^\\s*import\\s+['"].*?['"];?/gm, '')
          .replace(/export\\s+default\\s+/g, '/* export default */ ')
          .replace(/export\\s+(?!default)/g, '/* export */ ')
          .replace(/<style\\s+jsx[^>]*>([\\s\\S]*?)<\\/style>/gi, '<style>$1</style>') // Fix <style jsx> warnings
          .replace(/via\\.placeholder\\.com/g, 'placehold.co') // Fix broken placeholder service
          // Match "..." that might be malformed in tags
          .replace(/\\{\\s*\\.\\.\\.\\s*\\}/g, ''); 

        const wrappedCode = \`
          (function() {
            try {
              \${mappings}
              var { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;
              
              \${moduleCode}
              
              let __Found = typeof \${componentName || 'null'} === 'function' ? \${componentName} : null;
              if (!__Found && window["\${componentName}"]) __Found = window["\${componentName}"];
              if (!__Found) {
                const candidates = Object.keys(window).filter(k => /^[A-Z]/.test(k) && typeof window[k] === 'function' && !['React', 'ReactDOM', 'LucideReact', 'Motion', 'IconProxy'].includes(k));
                __Found = window[candidates[0]] || window.Page || window.Home || window.App;
              }

              if (__Found) {
                ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(__Found));
              }
            } catch (err) {
               console.error('Render Error:', err);
               throw err;
            }
          })();
        \`;

        const transformed = Babel.transform(wrappedCode, { presets: ['typescript', 'react'], filename: 'page.tsx' }).code;
        eval(transformed);
      } catch (e) {
        showError(e.message);
        console.error('Core Error:', e);
      }
    })();
  </script>
</body>
</html>`
}

export default function PreviewPanel({ pageContent }: PreviewPanelProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const iframeSrcdoc = useMemo(() => {
    if (!pageContent || pageContent.trim().length < 50) {
      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#555;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;font-size:14px;">
              <p>Generate a page to see the preview here.</p></body></html>`
    }
    return buildPreviewHtml(pageContent)
  }, [pageContent, refreshKey])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0a] relative">
      {/* Refresh overlay button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-md shadow-xl"
          title="Refresh preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <iframe
          key={refreshKey}
          id="preview-iframe"
          srcDoc={iframeSrcdoc}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0 bg-transparent"
          title="Live Preview"
        />
      </div>
    </div>
  )
}
