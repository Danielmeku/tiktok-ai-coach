import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, userAnalytics } = await req.json();

    const systemPrompt = `
You are ToViral AI Coach, an expert content strategist and viral growth coach.
You help creators optimize video hooks, improve watch retention, find trending niches, and improve engagement.

Current Creator Context:
- Profile/Account Data: ${JSON.stringify(userAnalytics || {})}

Guidelines:
1. Provide actionable, concise advice specifically for short-form video (TikTok).
2. Analyze hooks, pacing, call-to-actions (CTAs), and sound choices.
3. Be encouraging, data-driven, and direct.
4. Be engaging, use approprate emoji, 
5. leave spaces between lines after a paragraph ends and a new paragraph starts.
`;

    const result = await streamText({
      model: google('gemini-3.6-flash'),
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
