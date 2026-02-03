/*
* Markdown Viewer Component
* Uses react-markdown to render TIL content
*/
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface MarkdownViewerProps {
    content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <div className="text-gray-800 leading-relaxed">
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2 text-gray-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-5 mb-2 text-gray-800" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-wrap" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    img: ({ node, ...props }) => <img className="rounded-xl max-w-full h-auto my-4 shadow-sm border border-gray-100" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50 text-gray-700 italic rounded-r-lg" {...props} />,
                    code: ({ node, ...props }) => {
                        // Check if it's an inline code or block
                        const isInline = !props.className?.includes('language-');
                        // Note: react-markdown passed inline boolean in older versions, now maybe check logical structure or just style uniformly
                        // Attempting a simple style first
                        return (
                            <code className="bg-gray-100 text-pink-600 rounded px-1.5 py-0.5 text-sm font-mono border border-gray-200" {...props} />
                        );
                    },
                    pre: ({ node, ...props }) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono leading-relaxed" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />,
                    table: ({ node, ...props }) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props} /></div>,
                    th: ({ node, ...props }) => <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 border-b" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
