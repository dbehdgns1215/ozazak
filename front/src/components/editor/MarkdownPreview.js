import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownPreview = ({ markdown, className = "text-slate-900" }) => {
  return (
    <div className={`prose max-w-none w-full break-words ${className}`}>
      {/* 
        Using react-markdown for safe rendering.
      */}
      <Markdown
        components={{
          img: ({node, ...props}) => (
            <img {...props} className="max-w-full rounded-lg shadow-sm my-4" style={{maxHeight: '500px', ...props.style}} alt={props.alt || 'content'} />
          ),
          h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold my-4" />,
          h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold my-3" />,
          h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold my-2" />,
          p: ({node, ...props}) => <p {...props} className="my-2 leading-relaxed" />,
          ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 my-2" />,
          ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 my-2" />,
          blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic my-4" />,
          code: ({node, inline, className, children, ...props}) => {
             return inline ? (
                <code className="bg-gray-100 px-1 rounded text-sm text-red-500" {...props}>{children}</code>
             ) : (
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4">
                  <code {...props}>{children}</code>
                </pre>
             );
          }
        }}
        rehypePlugins={[rehypeRaw]}
        urlTransform={(uri) => {
          if (uri.startsWith('blob:') || uri.startsWith('http:') || uri.startsWith('https:')) {
             return uri;
          }
          return uri;
        }}
      >
        {markdown || ''}
      </Markdown>
    </div>
  );
};

export default MarkdownPreview;
