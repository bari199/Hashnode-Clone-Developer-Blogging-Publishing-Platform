import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownEditor = ({ content, setContent }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Markdown Editor */}
      <div>
        <label className="mb-2 block font-medium">Markdown</label>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your post using Markdown..."
          className="min-h-[500px] w-full resize-y rounded-lg border p-4 font-mono outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Preview */}
      <div>
        <label className="mb-2 block font-medium">Preview</label>

        <div className="min-h-[500px] overflow-auto rounded-lg border p-5">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                if (!inline && match) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                }

                return (
                  <code className="rounded bg-gray-100 px-1 py-0.5" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content || "Your Markdown preview will appear here..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
