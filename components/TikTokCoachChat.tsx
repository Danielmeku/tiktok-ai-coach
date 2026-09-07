// components/TikTokCoachChat.tsx
'use client';

import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';

interface TikTokCoachChatProps {
  userAnalytics?: Record<string, any>;
}

export default function TikTokCoachChat({ userAnalytics }: TikTokCoachChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      userAnalytics,
    },
  });

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl border dark:border-gray-800 rounded-lg p-4 bg-background shadow-md">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground my-auto pt-24">
            <h3 className="font-bold text-lg text-foreground">👋 Welcome to TikTok Coach AI</h3>
            <p className="text-sm mt-1">Ask for hook ideas, profile audits, or content strategy recommendations!</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg max-w-[85%] text-sm ${
              m.role === 'user'
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-auto'
            }`}
          >
            <p className="text-xs font-semibold mb-1 opacity-70">
              {m.role === 'user' ? 'You' : 'TikTok Coach'}
            </p>
            
            {/* Markdown Renderer */}
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-xs text-center mb-2">
          Error generating response. Check API configuration.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 pt-2 border-t dark:border-gray-800">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for a hook script or strategy review..."
          className="flex-1 px-3 py-2 border rounded-md text-sm bg-background dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}
