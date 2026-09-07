// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, userAnalytics } = await req.json();

    const systemPrompt = `
You are TikTok Coach AI, an expert content strategist and viral growth coach.
You help creators optimize video hooks, improve watch retention, find trending niches, and improve engagement.

Current Creator Context:
- Profile/Account Data: ${JSON.stringify(userAnalytics || {})}
`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("Chat API Execution Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
