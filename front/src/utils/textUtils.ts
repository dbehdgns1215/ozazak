
export const stripMarkdown = (markdown: string) => {
    if (!markdown) return '';
    
    // 1. Remove HTML tags
    let text = markdown.replace(/<[^>]*>/g, '');

    // 2. Remove Markdown Headings (e.g., # Title, ## Subtitle)
    text = text.replace(/^#+\s+/gm, '');

    // 3. Remove Images/Links (e.g., ![alt](url), [text](url))
    // Remove images first
    text = text.replace(/!\[.*?\]\(.*?\)/g, '');
    // Remove links but keep text: [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\(.*?\)/g, '$1');

    // 4. Remove Bold/Italic (e.g., **text**, *text*, __text__, _text_)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');

    // 5. Remove Blockquotes (>)
    text = text.replace(/^>\s+/gm, '');

    // 6. Remove Code Blocks (```code```) and Inline Code (`code`)
    text = text.replace(/```[\s\S]*?```/g, ''); // Multi-line code blocks
    text = text.replace(/`([^`]+)`/g, '$1');    // Inline code

    // 7. Remove Horizontal Rules (---, ***)
    text = text.replace(/^(-{3,}|\*{3,})$/gm, '');

    // 8. Trim whitespace
    return text.trim();
};
