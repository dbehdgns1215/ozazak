
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
