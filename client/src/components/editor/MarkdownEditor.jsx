import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Editor */}
      <div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write your post in Markdown..."
          className="min-h-[500px] w-full rounded-lg border border-gray-300 p-4 font-mono outline-none focus:border-black"
        />
      </div>

      {/* Preview */}
      <div className="min-h-[500px] rounded-lg border border-gray-300 p-4">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="rounded bg-gray-100 px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {value}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
