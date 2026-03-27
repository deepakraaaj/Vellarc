<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder Principle 1 -> I. Canonical Project Schema
- Placeholder Principle 2 -> II. Honest Product Behavior
- Placeholder Principle 3 -> III. Dual-Creation Flow Consistency
- Placeholder Principle 4 -> IV. Spec-Driven Delivery
- Placeholder Principle 5 -> V. Verification Before Merge
Added sections:
- Product Constraints
- Delivery Workflow
Removed sections:
- Placeholder Section 2
- Placeholder Section 3
Templates requiring updates:
- ✅ /home/deepakrajb/Downloads/documaster (1)/.specify/templates/plan-template.md
- ✅ /home/deepakrajb/Downloads/documaster (1)/.specify/templates/spec-template.md
- ✅ /home/deepakrajb/Downloads/documaster (1)/.specify/templates/tasks-template.md
- ✅ /home/deepakrajb/Downloads/documaster (1)/README.md
Follow-up TODOs:
- Consider ignoring `.codex/` in version control if this workspace becomes a git repository.
-->

# DocuMaster Constitution

## Core Principles

### I. Canonical Project Schema
The `Project` model in `types.ts` is the canonical product contract. Any change to
project data MUST update all affected surfaces in the same change set, including
seed data, manual editing, AI generation, dashboard summaries, and project review
screens. Schema changes that only update one authoring path or one display surface
are non-compliant.

Rationale: DocuMaster only works if manually authored and AI-generated documents
share the same structure and render consistently end to end.

### II. Honest Product Behavior
User-facing copy, controls, and success criteria MUST describe real behavior. A
feature that is not implemented end to end MUST be clearly labeled as placeholder
or kept out of primary workflows. Simulated export, search, persistence, settings,
or collaboration behavior cannot be presented as shipped functionality.

Rationale: A documentation product cannot earn trust while overstating its own
capabilities.

### III. Dual-Creation Flow Consistency
Manual creation and AI-assisted creation are both first-class product flows. Any
feature that affects project content MUST explicitly evaluate impact on dashboard
entry points, editor steps, AI wizard output, final project view, responsive
layouts, dark mode, and basic accessibility interactions. New content fields or
workflows may not exist in only one creation path without a written spec decision.

Rationale: Users must be free to start manually or with AI and still reach an
equivalent, reviewable project document.

### IV. Spec-Driven Delivery
Every non-trivial change MUST start with `/speckit.specify`, continue through
`/speckit.plan` and `/speckit.tasks`, and only then move into implementation.
Specifications MUST describe user value, affected product surfaces, assumptions,
edge cases, and measurable outcomes before technical execution begins.

Rationale: This project builds structured product specs; its own delivery process
must model the discipline it claims to provide.

### V. Verification Before Merge
Every change MUST pass `npm run build` and include manual validation notes for the
primary affected journey. Changes touching project schema, AI output, or cross-view
rendering MUST validate both a manual project flow and any affected AI or seeded
data flow. Automated tests, when added, MUST cover business-critical behavior
rather than purely presentational snapshots.

Rationale: The current codebase is a stateful frontend application, so the highest
risk regressions are content-flow breakage and inconsistent rendering.

## Product Constraints

- The default architecture is a Vite + React + TypeScript single-page application.
  New infrastructure or major dependencies MUST be justified in the plan with user
  value and maintenance cost.
- External services and AI integrations MUST use environment-based configuration.
  Secrets or tokens MUST never be hardcoded into source files.
- The current app stores project data in client memory. Any persistence, export, or
  collaboration feature MUST define a source of truth, loading/error states, and a
  migration strategy for existing seeded or generated documents.
- Changes with meaningful bundle-size or runtime impact MUST document the expected
  impact and any mitigation, such as code splitting or lazy loading.

## Delivery Workflow

- A feature plan MUST list which product surfaces change: dashboard, manual editor,
  AI wizard, project view, shared app state, setup docs, and any new artifacts.
- A feature that changes the project model MUST identify updates to `types.ts`,
  `mockData.ts`, `components/AIWizard.tsx`, `components/ProjectEditor.tsx`,
  `components/ProjectView.tsx`, `components/Dashboard.tsx`, and `App.tsx` when
  applicable.
- Completion is not reached until build verification passes, manual validation is
  recorded, and setup or workflow documentation is updated when behavior changes.

## Governance

This constitution supersedes ad hoc team habits for this repository. Amendments
MUST be made through `/speckit.constitution`, include a Sync Impact Report, and
update dependent templates in the same change. Versioning follows semantic
versioning for governance:

- MAJOR: Removes or redefines a principle in a backward-incompatible way.
- MINOR: Adds a principle or materially expands required workflow.
- PATCH: Clarifies wording without changing expected behavior.

Every implementation plan and review MUST check compliance with this constitution.
Any exception MUST be documented explicitly in the plan's Complexity Tracking
section with the rejected simpler alternative.

**Version**: 1.0.0 | **Ratified**: 2026-03-12 | **Last Amended**: 2026-03-12
