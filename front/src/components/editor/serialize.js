
/**
 * Converts editor blocks to a markdown string.
 * - Joins blocks with double newline.
 * - Filters out empty paragraph blocks (except during editing, but this function is usually for submit).
 * - Format:
 *   - Paragraph: just text
 *   - Image: ![alt](url)
 * 
 * @param {Array} blocks 
 * @returns {string} markdown
 */
export const blocksToMarkdown = (blocks) => {
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') {
        const text = block.text.trim();
        return text ? text : null; // Return null for empty blocks to filter them out
      }
      if (block.type === 'image') {
        // Use HTML for precise control
        const style = block.style || {};
        const width = style.width ? `${style.width}px` : 'auto';
        const height = style.height ? `${style.height}px` : 'auto';
        const align = style.align || 'center';
        const caption = block.caption || '';
        
        return `
<figure style="text-align: ${align}; margin: 2rem 0;">
  <img src="${block.url}" alt="${block.alt || 'image'}" style="width: ${width}; height: ${height}; display: inline-block;" />
  ${caption ? `<figcaption style="text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">${caption}</figcaption>` : ''}
</figure>`;
      }
      return null;
    })
    .filter((content) => content !== null) // Remove empty/null blocks
    .join('\n\n'); // Markdown paragraphs separated by blank line
};
// Helper to extract attributes from style string
const getStyle = (str, prop) => {
    const match = str.match(new RegExp(`${prop}:\\s*([^;]+)`));
    return match ? match[1].trim() : null;
};

/**
 * Converts stored markdown/HTML back to editor blocks.
 * Simple parser for our specific format.
 */
export const markdownToBlocks = (markdown) => {
    if (!markdown) return [{ id: crypto.randomUUID(), type: 'paragraph', text: '' }];

    // Split by double newline to separate blocks
    // Note: This regex splits by \n\n but respects potentially nested structures if strictly formatted
    const rawBlocks = markdown.split(/\n\s*\n/).filter(b => b.trim());
    
    return rawBlocks.map(content => {
        const trimmed = content.trim();

        // 1. Image Check (<figure> pattern)
        if (trimmed.startsWith('<figure') && trimmed.includes('<img')) {
            try {
                // Extract src
                const srcMatch = trimmed.match(/src="([^"]+)"/);
                const url = srcMatch ? srcMatch[1] : '';

                // Extract alt
                const altMatch = trimmed.match(/alt="([^"]+)"/);
                const alt = altMatch ? altMatch[1] : '';

                // Extract style (width, height) from img tag
                const imgTag = trimmed.match(/<img[^>]+>/)[0];
                const widthVal = getStyle(imgTag, 'width');
                const heightVal = getStyle(imgTag, 'height');
                
                // Parse pixel values
                const width = widthVal && widthVal.endsWith('px') ? parseFloat(widthVal) : null;
                const height = heightVal && heightVal.endsWith('px') ? parseFloat(heightVal) : null;

                // Extract align from figure style
                const figureTag = trimmed.match(/<figure[^>]+>/)[0];
                const align = getStyle(figureTag, 'text-align') || 'center';

                // Extract caption
                let caption = '';
                const captionMatch = trimmed.match(/<figcaption[^>]*>(.*?)<\/figcaption>/);
                if (captionMatch) {
                    caption = captionMatch[1];
                }

                return {
                    id: crypto.randomUUID(),
                    type: 'image',
                    url: url,
                    alt: alt,
                    caption: caption,
                    style: { width, height, align, keepRatio: true } // Assume true for simplicity
                };

            } catch (e) {
                console.warn("Failed to parse image block", e);
                return { id: crypto.randomUUID(), type: 'paragraph', text: trimmed }; // Fallback
            }
        }

        // 2. Paragraph (Default)
        return {
            id: crypto.randomUUID(),
            type: 'paragraph',
            text: trimmed
        };
    });
};
