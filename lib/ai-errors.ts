/**
 * Detects if a Gemini API error is related to quota or rate limits.
 * Gemini errors typically have a code like 429 or a message containing "quota".
 */
export function isQuotaError(error: any): boolean {
    if (!error) return false;

    const msg = (error.message || '').toLowerCase();
    const status = error.status || (error.response ? error.response.status : null);

    // 429 is the standard HTTP code for rate limiting
    if (status === 429) return true;

    // Check for common quota-related strings in the error message
    if (msg.includes('quota exceeded') ||
        msg.includes('rate limit') ||
        msg.includes('too many requests') ||
        msg.includes('exhausted')) {
        return true;
    }

    return false;
}

export const VYANA_TIRED_ERROR = 'VYANA_TIRED';
