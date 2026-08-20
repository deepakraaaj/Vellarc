// Supabase Edge Function: proposes a system architecture diagram (nodes +
// edges, no positions — the client auto-layouts them) for the "Suggest with
// AI" button on the Architecture step. Deploy with:
//   supabase functions deploy generate-architecture
// Shares the GEMINI_API_KEY secret with the gemini-chat function.

import { GoogleGenAI, type FunctionDeclaration } from 'npm:@google/genai@^1.31.0';
import { architectureSchema } from '../_shared/architectureTool.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const proposeArchitectureTool: FunctionDeclaration = {
  name: 'propose_architecture',
  description: 'Propose a system architecture diagram for the described software project.',
  parameters: architectureSchema,
};

interface RequestBody {
  title?: string;
  tagline?: string;
  problemOverview?: string;
  features?: { name: string; description?: string }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server is missing GEMINI_API_KEY' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const title = body.title?.trim() || 'Untitled Project';
    const featureList = (body.features ?? [])
      .slice(0, 12)
      .map((f) => `- ${f.name}${f.description ? `: ${f.description}` : ''}`)
      .join('\n');

    const prompt = `Project: ${title}
${body.tagline ? `Tagline: ${body.tagline}\n` : ''}${body.problemOverview ? `Problem: ${body.problemOverview}\n` : ''}${
      featureList ? `Key features:\n${featureList}\n` : ''
    }
Propose a clear, practical system architecture for this project: 5-9 major components (e.g. client, frontend, backend/API, database, cache, auth, external integrations as relevant) and the connections between them. Prefer a realistic, buildable architecture over an exhaustive one. Call propose_architecture with your answer.`;

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction:
          'You are a pragmatic software architect. Given a project brief, propose a system architecture diagram by calling the propose_architecture tool. Do not output prose or JSON as text — only use the tool.',
        tools: [{ functionDeclarations: [proposeArchitectureTool] }],
      },
    });

    const result = await chat.sendMessage({ message: prompt });
    const call = result.functionCalls?.[0];

    if (!call || call.name !== 'propose_architecture') {
      return new Response(JSON.stringify({ error: 'The AI did not return a usable architecture. Please try again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ architecture: call.args }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('generate-architecture error', err);
    return new Response(JSON.stringify({ error: 'Failed to reach the AI service. Please try again.' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
