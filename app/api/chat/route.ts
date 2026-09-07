// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds on Vercel
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userAnalytics } = await req.json();

  // Create system instructions tailored to TikTok Coaching
  const systemPrompt = `
You are TikTok Coach AI, an expert content strategist and viral growth coach.
You help creators optimize video hooks, improve watch retention, find trending niches, and improve engagement.

Current Creator Context:
- Profile/Account Data: ${JSON.stringify(userAnalytics || {})}

Guidelines:
1. Provide actionable, concise advice specifically for short-form video (TikTok).
2. Analyze hooks, pacing, call-to-actions (CTAs), and sound choices.
3. Be encouraging, data-driven, and direct.
`;

  const result = streamText({
    model: google('gemini-1.5-flash'), // or google('gemini-1.5-pro')
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
