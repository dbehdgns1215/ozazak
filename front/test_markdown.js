
const removeMarkdown = (markdown) => {
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
        // HTML Tags
        .replace(/<[^>]*>/g, '')
        // Newlines/Extra spaces
        .replace(/\n+/g, ' ')
        .trim();
};

const input = `인프라 세팅 <figure style="text-align: center; margin: 2rem 0;"> <img src="https://ozazak.s3.ap-northeast-2.amazonaws.com/test.jpg"> </figure> Text after.`;
const output = removeMarkdown(input);

console.log("Input:", input);
console.log("Output:", output);

if (output.includes('<figure') || output.includes('<img')) {
    console.error("FAIL: HTML tags not removed.");
} else {
    console.log("SUCCESS: HTML tags removed.");
}
