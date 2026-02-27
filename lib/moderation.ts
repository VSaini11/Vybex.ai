/**
 * Local Content Moderation Utility
 * Performs whole-word keyword and regex based checks on user prompts.
 * Uses \b word boundaries to avoid false positives on substrings
 * (e.g. "skills" should NOT trigger "kill", "class" should NOT trigger "ass").
 */

const BANNED_KEYWORDS = [
    // Sexual content
    'porn', 'sex', 'sexual', 'nude', 'naked', 'nsfw', 'xxx', 'erotic', 'hentai',
    // Abusive/Vulgar
    'abuse', 'kill', 'hate', 'racist', 'terrorist', 'violence', 'blood',
    // Explicit vulgar words
    'fuck', 'shit', 'asshole', 'bitch', 'dick', 'pussy'
]

// Pre-compile whole-word patterns for each banned keyword
const BANNED_KEYWORD_PATTERNS = BANNED_KEYWORDS.map(
    (word) => new RegExp(`\\b${word}\\b`, 'i')
)

const BANNED_PATTERNS = [
    /\b(p[0-9]rn|s[3e]x)\b/i, // Obfuscated words
]

export function isPromptOffensive(prompt: string): boolean {
    const normalizedPrompt = prompt.toLowerCase().trim()

    // 1. Whole-word keyword check (uses \b boundaries — no false positives on substrings)
    for (const pattern of BANNED_KEYWORD_PATTERNS) {
        if (pattern.test(normalizedPrompt)) {
            return true
        }
    }

    // 2. Extra pattern check
    for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(normalizedPrompt)) {
            return true
        }
    }

    return false
}
