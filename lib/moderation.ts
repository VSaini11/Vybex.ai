/**
 * Local Content Moderation Utility
 * Performs keyword and regex based checks on user prompts.
 */

const BANNED_KEYWORDS = [
    // Sexual content
    'porn', 'sex', 'sexual', 'nude', 'naked', 'nsfw', 'xxx', 'erotic', 'hentai',
    // Abusive/Vulgar
    'abuse', 'kill', 'hate', 'racist', 'terrorist', 'violence', 'blood',
    // Add more specific vulgar keywords as needed
    'fuck', 'shit', 'asshole', 'bitch', 'dick', 'pussy'
]

const BANNED_PATTERNS = [
    /\b(p[0-9]rn|s[3e]x)\b/i, // Obfuscated words
]

export function isPromptOffensive(prompt: string): boolean {
    const normalizedPrompt = prompt.toLowerCase().trim()

    // 1. Keyword check
    for (const word of BANNED_KEYWORDS) {
        if (normalizedPrompt.includes(word)) {
            return true
        }
    }

    // 2. Pattern check
    for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(normalizedPrompt)) {
            return true
        }
    }

    return false
}
