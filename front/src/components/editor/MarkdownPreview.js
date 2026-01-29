import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownPreview = ({ markdown }) => {
  return (
    <div className="prose prose-slate max-w-none w-full break-words text-slate-900">
      {/* 
        Using react-markdown for safe rendering.
        Tailwind 'prose' (typography plugin) handles the styling primarily,
        but we don't have it installed in this project based on package.json,
        so we relying on base styles and some custom CSS might be needed for headings.
      */}
      <Markdown
        components={{
          img: ({node, ...props}) => (
            <img {...props} className="max-w-full rounded-lg shadow-sm my-4" style={{maxHeight: '500px', ...props.style}} alt={props.alt || 'content'} />
          ),
          h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold my-4" />,
          h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold my-3" />,
          h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold my-2 text-slate-800" />,
          p: ({node, ...props}) => <p {...props} className="my-2 leading-relaxed text-slate-700" />,
          ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 my-2 text-slate-700" />,
          ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 my-2 text-slate-700" />,
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
        {markdown || '*Preview will appear here...*'}
      </Markdown>
    </div>
  );
};

export default MarkdownPreview;
