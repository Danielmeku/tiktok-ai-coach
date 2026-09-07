// components/TikTokCoachChat.tsx
'use client';

import { useChat } from 'ai/react';

interface TikTokCoachChatProps {
  userAnalytics?: Record<string, any>;
}

export default function TikTokCoachChat({ userAnalytics }: TikTokCoachChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userAnalytics, // Passes account metrics to the serverless route
    },
  });

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-lg p-4 bg-background shadow-md">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground my-auto pt-10">
            <h3 className="font-bold text-lg text-foreground">👋 Welcome to TikTok Coach AI</h3>
            <p className="text-sm mt-1">Ask for hook ideas, profile audits, or content strategy recommendations!</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg max-w-[80%] ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted text-muted-foreground mr-auto'
            }`}
          >
            <p className="text-xs font-semibold mb-1 opacity-70">
              {m.role === 'user' ? 'You' : 'TikTok Coach'}
            </p>
            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 pt-2 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for a hook script or strategy review..."
          className="flex-1 px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
