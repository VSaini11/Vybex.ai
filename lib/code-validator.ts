import { parse } from '@babel/parser';

/**
 * Robustly unescapes HTML entities, handling multiple levels of encoding.
 */
function superUnescape(str: string): string {
    let lastStr = '';
    let currentStr = str;

    // Keep unescaping until no more changes happen (handles &amp;amp;lt;)
    while (currentStr !== lastStr) {
        lastStr = currentStr;
        currentStr = currentStr
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&apos;/gi, "'")
            .replace(/&#x27;/gi, "'")
            .replace(/&#x2F;/gi, "/");
    }
    return currentStr;
}

export interface ValidationResult {
    isValid: boolean;
    code: string;
    error?: string;
}

/**
 * Validates React/TypeScript code using Babel and applies common AI fixes.
 */
export function validateAndFixCode(code: string): ValidationResult {
    // 1. Initial cleanup and unescaping
    let cleaned = superUnescape(code.trim());

    // 2. Ensure 'use client' is correctly placed
    if (cleaned.match(/^\s*use client['"]?;?/i)) {
        cleaned = cleaned.replace(/^\s*use client['"]?;?/i, "'use client';");
    } else if (!cleaned.startsWith("'use client'")) {
        cleaned = "'use client';\n" + cleaned;
    }

    // 3. Syntax Validation using Babel
    try {
        parse(cleaned, {
            sourceType: 'module',
            plugins: [
                'typescript',
                'jsx',
                'decorators-legacy',
                'classProperties',
            ],
        });

        return {
            isValid: true,
            code: cleaned
        };
    } catch (err: any) {
        console.error('[CodeValidator] Syntax Error detected:', err.message);

        // Return the cleaned code even if invalid, but mark as invalid so API can handle it
        return {
            isValid: false,
            code: cleaned,
            error: err.message
        };
    }
}
