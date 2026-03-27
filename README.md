<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xrpj0G-krJOclq74ceMhzmhlHznzOUuQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Spec-Driven Workflow

This project uses `spec-kit` with Codex prompts stored in [.codex/prompts](.codex/prompts)
and shared templates in [.specify](.specify).

1. Export the project-specific Codex home:
   `export CODEX_HOME='/home/deepakrajb/Downloads/documaster (1)/.codex'`
2. Establish or amend governance:
   `/speckit.constitution`
3. Create a feature specification:
   `/speckit.specify`
4. Create the implementation plan:
   `/speckit.plan`
5. Break the work into tasks:
   `/speckit.tasks`
6. Execute the implementation:
   `/speckit.implement`
