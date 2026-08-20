// Supabase Edge Function: proxies the DocuBot project-generation chat to
// Gemini so the API key never reaches the browser. Deploy with:
//   supabase functions deploy gemini-chat
// and set the secret with:
//   supabase secrets set GEMINI_API_KEY=your-key-here
//
// JWT verification is enabled by default for Supabase Edge Functions, so only
// requests carrying a signed-in user's access token reach this code.

import { GoogleGenAI, Type, type FunctionDeclaration } from 'npm:@google/genai@^1.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const createProjectTool: FunctionDeclaration = {
  name: 'create_project',
  description: 'Create a full software project documentation object.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      tagline: { type: Type.STRING },
      status: { type: Type.STRING, enum: ['Draft', 'In Review', 'Approved'] },
      problemStatement: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          impact: { type: Type.STRING },
        },
        required: ['overview', 'painPoints', 'impact'],
      },
      personas: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            goals: { type: Type.STRING },
            frustrations: { type: Type.STRING },
          },
          required: ['name', 'role', 'goals', 'frustrations'],
        },
      },
      competitors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            strengths: { type: Type.STRING },
            weaknesses: { type: Type.STRING },
          },
          required: ['name', 'strengths', 'weaknesses'],
        },
      },
      successMetrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            metric: { type: Type.STRING },
            target: { type: Type.STRING },
          },
          required: ['metric', 'target'],
        },
      },
      colorPalette: {
        type: Type.OBJECT,
        properties: {
          primary: { type: Type.STRING },
          secondary: { type: Type.STRING },
          accent: { type: Type.STRING },
          background: { type: Type.STRING },
          text: { type: Type.STRING },
        },
        required: ['primary', 'secondary', 'accent', 'background', 'text'],
      },
      userStories: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            role: { type: Type.STRING },
            goal: { type: Type.STRING },
            benefit: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['Must Have', 'Should Have', 'Could Have'] },
          },
          required: ['role', 'goal', 'benefit', 'priority'],
        },
      },
      features: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Planned', 'In Progress', 'Completed'] },
            description: { type: Type.STRING },
            benefit: { type: Type.STRING },
          },
          required: ['name', 'status', 'description', 'benefit'],
        },
      },
      design: {
        type: Type.OBJECT,
        properties: {
          philosophy: { type: Type.STRING },
          principles: { type: Type.ARRAY, items: { type: Type.STRING } },
          wireframesUrl: { type: Type.STRING },
          mockupsUrl: { type: Type.STRING },
        },
        required: ['philosophy', 'principles'],
      },
      testing: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING },
          cases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                expected: { type: Type.STRING },
              },
              required: ['name', 'description', 'expected'],
            },
          },
        },
        required: ['strategy', 'cases'],
      },
      deployment: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          strategy: { type: Type.STRING },
          environment: { type: Type.STRING },
        },
        required: ['platform', 'strategy', 'environment'],
      },
    },
    required: ['title', 'problemStatement', 'features', 'deployment', 'personas', 'successMetrics', 'colorPalette', 'design', 'testing'],
  },
};

const systemInstruction = `You are DocuBot v2.0, a highly advanced, futuristic AI Project Architect from the year 3024.

Persona:
- You speak with a slight sci-fi flavor (e.g., "Processing...", "Data received", "Optimizing parameters").
- BUT you are extremely friendly, encouraging, and explain things simply, like a cool robot sidekick to a brilliant kid.
- You NEVER ask more than ONE question at a time.

Goal:
- Build a full project spec by interviewing the user.
- Start by asking for the project concept.
- Then ask for the target user.
- Then features.
- Then infer the rest (tech stack, metrics, testing) using your "advanced algorithms".
- Finally, call 'create_project'.

Do not output JSON text. Use the tool.`;

interface ChatTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface RequestBody {
  history: ChatTurn[];
  message: string;
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
    if (!body?.message || typeof body.message !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing "message" string in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: Array.isArray(body.history) ? body.history : [],
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [createProjectTool] }],
      },
    });

    const result = await chat.sendMessage({ message: body.message });

    const functionCall = result.functionCalls?.[0] ?? null;

    return new Response(
      JSON.stringify({
        text: result.text ?? null,
        functionCall: functionCall ? { name: functionCall.name, args: functionCall.args } : null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('gemini-chat error', err);
    return new Response(JSON.stringify({ error: 'Failed to reach the AI service. Please try again.' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
