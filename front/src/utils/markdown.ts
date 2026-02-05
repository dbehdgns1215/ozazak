
/**
 * Strips markdown syntax from a string to return plain text.
 * useful for previews.
 * @param {string} markdown
 * @returns {string} plain text
 */
export const removeMarkdown = (markdown: string): string => {
    if (!markdown) return '';
    
    return markdown
        // Headers
        .replace(/^#+\s+/gm, '')
        // Bold/Italic
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Links
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        // Images
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
        // Blockquotes
        .replace(/^>\s+/gm, '')
        // Code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Inline code
        .replace(/`([^`]+)`/g, '$1')
        // Lists
        .replace(/^[\*\-\+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        // Horizontal Rules
        .replace(/^\s*[-*_]{3,}\s*$/gm, '')
        // Decode HTML entities (basic) before stripping tags to catch &lt;script&gt; etc.
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
        // HTML Tags
        .replace(/<[^>]*>/g, '')
        // Newlines/Extra spaces
        .replace(/\n+/g, ' ')
        .trim();
};
