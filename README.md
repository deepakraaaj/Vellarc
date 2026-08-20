# SpecArc

SpecArc is a React + Vite frontend for turning rough product ideas into build-ready product briefs, architecture context, and software planning. Users can create a project manually, refine it in a guided editor, review a presentation-style project view, or generate an initial draft with Gemini-powered chat.

Auth and data persistence are backed by [Supabase](https://supabase.com): every project lives in Postgres, scoped to its owner, and the app is gated behind sign-in.

## What the App Includes

- A dashboard for browsing projects and starting new work
- A multi-step editor for product basics, problem framing, personas, metrics, features, design, testing, and deployment
- A presentation view for reviewing completed project documentation, including delete
- A floating AI chat assistant that interviews the user and generates a structured project object with Gemini
- Dark mode support and a highly styled glassmorphism UI
- Email/password sign-in via Supabase Auth, gating the whole app

## Architecture

- **Frontend**: React 19 + Vite, client-only SPA.
- **Auth**: Supabase Auth (email/password). Every route is gated behind a signed-in session (`App.tsx` renders `AuthScreen` until `useAuth()` resolves a user). Google OAuth is wired in `contexts/AuthContext.tsx` but currently disabled in the UI — see [components/Auth/AuthScreen.tsx](components/Auth/AuthScreen.tsx) to re-enable it.
- **Data**: Projects are stored in Supabase Postgres (`public.projects`), one row per project, scoped to the owning user via Row Level Security — see [`supabase/schema.sql`](supabase/schema.sql).
- **AI**: The Gemini chat used by the AI assistant runs behind a Supabase Edge Function ([`supabase/functions/gemini-chat`](supabase/functions/gemini-chat)) so the `GEMINI_API_KEY` never ships to the browser.

## Tech Stack

- React 19
- TypeScript
- Vite
- `@supabase/supabase-js`
- `lucide-react`
- Tailwind via CDN in `index.html`

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- A Supabase project (free tier is fine)
- (Optionally) the [Supabase CLI](https://supabase.com/docs/guides/cli) for deploying the edge function
- A Gemini API key if you want to use the AI assistant

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) to create the `projects` table and its RLS policies.
3. Under **Authentication → Providers**, Email is on by default. (Google is supported in code but disabled in the UI for now — see Architecture above.)
4. Under **Project Settings → API**, copy the **Project URL** and **anon/public key**.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

These are safe to expose client-side — RLS policies (not secrecy of this key) are what protect user data.

### 4. Deploy the Gemini edge function

The Gemini API key must **never** be a `VITE_*` variable (that would ship it to every visitor's browser). Instead it's a server-side secret used only by the edge function:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase functions deploy gemini-chat
```

The function has JWT verification enabled by default, so only requests from a signed-in user reach it.

### 5. Run Locally

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

## Production Checklist

- [x] Auth required for all app routes; sessions persisted and auto-refreshed via Supabase.
- [x] Per-user data isolation enforced at the database layer (RLS), not just in the UI.
- [x] No secret API keys bundled into client JS (the Gemini SDK only runs server-side in the edge function).
- [x] Top-level `ErrorBoundary` so a render crash doesn't blank the whole app.
- [x] Loading and error states around auth resolution and project fetch/save/delete, with retry.
- [ ] Add automated tests (none exist yet — recommend Vitest + React Testing Library for components, and a couple of integration tests against a local Supabase instance for `services/projectsService.ts`).
- [ ] Wire a CI pipeline (typecheck + build) before deploying, e.g. GitHub Actions running `npm run build`.
- [ ] Set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as environment variables in your hosting provider (Vercel/Netlify/etc.) — don't rely on `.env.local` in production builds.
- [ ] Consider code-splitting via dynamic `import()` if bundle size becomes a concern.
- [ ] Re-enable Google OAuth in `AuthScreen.tsx` if you want it live (the provider call already exists in `AuthContext`).

## Project Structure

```text
.
├── App.tsx                          # Top-level app state, auth gate, and view switching
├── components/
│   ├── AIWizard.tsx                 # Gemini-assisted project generation (via edge function)
│   ├── Auth/AuthScreen.tsx          # Sign-in / sign-up screen
│   ├── Dashboard.tsx                # Project library and entry points
│   ├── ErrorBoundary.tsx            # Top-level render error fallback
│   ├── ProjectEditor.tsx            # Multi-step manual editing flow
│   ├── ProjectView.tsx              # Presentation-style project details view, with delete
│   └── Sidebar.tsx                  # Navigation, account, and theme toggle
├── contexts/AuthContext.tsx         # Supabase session/auth state
├── lib/supabaseClient.ts            # Supabase client singleton
├── services/projectsService.ts      # Project CRUD against Supabase
├── supabase/
│   ├── schema.sql                   # projects table + RLS policies
│   └── functions/gemini-chat/       # Edge function proxying Gemini chat
├── mockData.ts                      # Seed project used for "New Project"
├── types.ts                         # Shared project data model
├── updated_prd.md                   # Product direction for SpecArc v2
├── v2_data_model.md                 # Proposed v2 data model
└── v2_ux_flow_spec.md               # Proposed v2 UX flow
```

## Product Direction

The repo also includes planning documents for a broader SpecArc v2 pivot: evolving from a documentation builder into an AI product architect workspace that turns vague ideas into build-ready context, architecture guidance, phased plans, and prompt packs.

If you want to continue that direction, start with:

- `updated_prd.md`
- `v2_data_model.md`
- `v2_ux_flow_spec.md`
