import client from './client';

/**
 * Normalize tags: split by comma, trim, dedupe case-insensitively (preserve first casing), remove empty
 */
function normalizeTags(tagsInput) {
    if (!tagsInput || typeof tagsInput !== 'string') return null;
    
    const tagArray = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    
    if (tagArray.length === 0) return null;
    
    // Dedupe case-insensitively, preserve first occurrence casing
    const seen = new Map();
    const deduped = [];
    
    for (const tag of tagArray) {
        const lowerTag = tag.toLowerCase();
        if (!seen.has(lowerTag)) {
            seen.set(lowerTag, true);
            deduped.push(tag);
        }
    }
    
    return deduped.join(',');
}

/**
 * Fetch TILs from API
 * @param {Object} params - Query parameters
 * @param {string} params.authorStatus - "passed" | "default" | undefined
 * @param {string|Array} params.tags - Comma-separated string or array
 * @param {number} params.page - Page number (default 1)
 * @param {number} params.size - Page size (default 10)
 * @param {number} params.authorId - Filter by specific author
 * @param {string} params.authorName - Filter by author name
 * @param {AbortSignal} params.signal - AbortController signal for cancellation
 */
export async function getTils(params = {}) {
    const {
        authorStatus,
        tags,
        page = 1,
        size = 10,
        authorId,
        authorName,
        signal
    } = params;
    
    // Build query params object
    const queryParams = {
        page,
        size
    };
    
    // Add optional params only if defined
    if (authorStatus && (authorStatus === 'passed' || authorStatus === 'default')) {
        queryParams['author-status'] = authorStatus;
    }
    
    if (authorId !== undefined && authorId !== null && authorId !== '') {
        queryParams['author-id'] = authorId;
    }
    
    if (authorName !== undefined && authorName !== null && authorName !== '') {
        queryParams.authorName = authorName;
    }
    
    // Normalize tags
    const normalizedTags = normalizeTags(Array.isArray(tags) ? tags.join(',') : tags);
    if (normalizedTags) {
        queryParams.tags = normalizedTags;
    }
    
    // Make request
    const response = await client.get('/api/til', {
        params: queryParams,
        signal
    });
    
    return response.data;
}
