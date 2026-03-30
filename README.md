# SpecArc

SpecArc is a polished React + Vite frontend for turning rough product ideas into build-ready product briefs, architecture context, and software planning. The current app lets users create a project manually, refine it in a guided editor, review a presentation-style project view, or generate an initial draft with Gemini-powered chat.

This repository currently contains the frontend prototype and a lightweight Supabase-backed persistence layer. When Supabase is configured, project saves are stored in your database. When it is not configured yet, the app falls back to local demo data so the UI still works.

## What the App Includes

- A dashboard for browsing projects and starting new work
- A multi-step editor for product basics, problem framing, personas, metrics, features, design, testing, and deployment
- A presentation view for reviewing completed project documentation
- An AI wizard that interviews the user and generates a structured project object with Gemini
- Dark mode support and a highly styled glassmorphism UI

## Tech Stack

- React 19
- TypeScript
- Vite
- `@google/genai`
- `@supabase/supabase-js`
- `lucide-react`
- Tailwind via CDN in `index.html`

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- An npm-compatible environment
- A Gemini API key if you want to use the AI wizard

### Install

```bash
npm install
```

### Configure Environment

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can also use `VITE_GEMINI_API_KEY` if you prefer standard Vite-prefixed client env vars.

An `.env.example` file is included in the repo with the expected keys.

### Set Up Supabase

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run [`supabase/projects.sql`](/home/user/Desktop/Vellarc/supabase/projects.sql).
4. Copy your project URL and anon key into `.env.local`.
5. Restart `npm run dev`.

The SQL file creates a `projects` table, keeps `updated_at` fresh on every update, and adds prototype-friendly RLS policies so the browser client can read and write. Tighten those policies before using this in production.

### Run Locally

```bash
npm run dev
```

The dev server is configured for `http://0.0.0.0:3000`.

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Project Structure

```text
.
├── App.tsx                 # Top-level app state and view switching
├── .env.example            # Example local environment variables
├── components/
│   ├── AIWizard.tsx        # Gemini-assisted project generation
│   ├── Dashboard.tsx       # Project library and entry points
│   ├── ProjectEditor.tsx   # Multi-step manual editing flow
│   ├── ProjectView.tsx     # Presentation-style project details view
│   └── Sidebar.tsx         # Navigation and theme toggle
├── lib/
│   ├── projectStore.ts     # Supabase project fetch/save helpers
│   ├── projectUtils.ts     # Project cloning, IDs, and save preparation
│   └── supabase.ts         # Supabase client bootstrap
├── mockData.ts             # Seed project shown on first load
├── supabase/
│   └── projects.sql        # SQL schema and RLS policies for the `projects` table
├── types.ts                # Shared project data model
├── updated_prd.md          # Product direction for SpecArc v2
├── v2_data_model.md        # Proposed v2 data model
└── v2_ux_flow_spec.md      # Proposed v2 UX flow
```

## Notes and Current Limitations

- Supabase access is currently browser-side and uses prototype-friendly public policies
- Search on the dashboard is currently visual only
- There is no auth flow yet, so the included Supabase policies are intentionally broad for prototyping
- There is no automated test suite configured yet

## Product Direction

The repo also includes planning documents for a broader SpecArc v2 pivot: evolving from a documentation builder into an AI product architect workspace that turns vague ideas into build-ready context, architecture guidance, phased plans, and prompt packs.

If you want to continue that direction, start with:

- `updated_prd.md`
- `v2_data_model.md`
- `v2_ux_flow_spec.md`
