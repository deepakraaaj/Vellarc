# SpecArc

SpecArc is a polished React + Vite frontend for turning rough product ideas into build-ready product briefs, architecture context, and software planning. The current app lets users create a project manually, refine it in a guided editor, review a presentation-style project view, or generate an initial draft with Gemini-powered chat.

This repository currently contains the frontend prototype and local mock data. Project data lives in React state, so changes are not persisted across reloads.

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
```

Vite maps `GEMINI_API_KEY` to the client-side values used by the app.

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
├── components/
│   ├── AIWizard.tsx        # Gemini-assisted project generation
│   ├── Dashboard.tsx       # Project library and entry points
│   ├── ProjectEditor.tsx   # Multi-step manual editing flow
│   ├── ProjectView.tsx     # Presentation-style project details view
│   └── Sidebar.tsx         # Navigation and theme toggle
├── mockData.ts             # Seed project shown on first load
├── types.ts                # Shared project data model
├── updated_prd.md          # Product direction for SpecArc v2
├── v2_data_model.md        # Proposed v2 data model
└── v2_ux_flow_spec.md      # Proposed v2 UX flow
```

## Notes and Current Limitations

- Data is stored only in local component state
- Search on the dashboard is currently visual only
- There is no backend, auth flow, or database integration yet
- There is no automated test suite configured yet

## Product Direction

The repo also includes planning documents for a broader SpecArc v2 pivot: evolving from a documentation builder into an AI product architect workspace that turns vague ideas into build-ready context, architecture guidance, phased plans, and prompt packs.

If you want to continue that direction, start with:

- `updated_prd.md`
- `v2_data_model.md`
- `v2_ux_flow_spec.md`
