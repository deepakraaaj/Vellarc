# DocuMaster v2 PRD

## Product Name

DocuMaster

## Current Application Context

This repository already implements a polished frontend application with four
real product surfaces:

- a **Dashboard** for project discovery and entry points
- an **AI Wizard** for conversational project generation
- a **Project Editor** for structured manual authoring
- a **Project View** for presenting the completed documentation

The current app is positioned as a software documentation builder for
engineering teams and already supports:

- creating a project manually
- generating a project through a Gemini-powered conversational flow
- editing project details across multiple structured sections
- viewing a polished documentation page
- tracking high-level project metadata such as title, status, personas,
  competitors, features, testing, and deployment notes

The core issue is not UI quality. The issue is that the application is still a
generic documentation generator. It captures project content, but it does not
yet solve the deeper problem of helping users who do not know what to ask,
what information matters, or what an AI builder actually needs.

## Product Pivot

DocuMaster v2 should evolve from:

**"a beautiful software documentation builder"**

into:

**"an AI product architect and visual planning workspace that converts vague
ideas into build-ready context, documentation, architecture, phased tasks, and
prompt packs."**

This product should not promise to build the final application itself.

It should promise to:

- collect the right information
- ask the right questions
- structure the right context
- track the reasoning behind product decisions
- break large products into small achievable phases and tasks
- visually show what is being planned and what the outcome should look like
- produce the best possible prompt pack for downstream AI app-building agents

## Core Problem

Users commonly start with only a rough statement such as:

`I need to create a vehicle tracking application`

At that moment, the user usually does not know:

- what details an LLM actually needs
- which product questions matter most
- what should be included in v1
- what architecture constraints are important
- how to express the idea clearly enough for high-quality generation

Most AI agents fail not because they are weak coders, but because they are given
weak input:

- vague problem framing
- missing user context
- missing workflows
- no clear priorities
- no explicit non-goals
- no assumptions log
- no phased breakdown

DocuMaster v2 should solve that context failure before any downstream
application-generation prompt is produced.

## Product Vision

Enable a user to start with a single raw idea and end with:

- a complete product brief
- a structured visual PRD
- architecture guidance
- phased implementation planning
- tracked assumptions and decisions
- a build-ready prompt pack that can be given to an AI coding agent

## Target Users

### Primary Users

- startup founders using AI to create products
- solo builders who want to generate applications with LLMs
- early product managers who need structured product discovery
- agencies turning client ideas into build-ready AI specs

### Secondary Users

- engineering leads creating clearer AI handoff context
- technical consultants defining architecture and delivery scope

## Jobs To Be Done

### Primary Job

When I have only a vague app idea, I want DocuMaster to ask the right
questions, build the right context, and generate the right prompt pack so that
an AI builder can produce a much better result than it would from my raw idea
alone.

### Supporting Jobs

- Help me think clearly when I do not know what to ask
- Turn rough intent into a structured product definition
- Separate MVP from later phases
- Expose missing information, assumptions, and risks
- Keep track of decisions over time

## Product Positioning

DocuMaster v2 is not:

- a generic PRD tool
- a generic prompt generator
- a no-code app builder

DocuMaster v2 is:

**a visual AI product architecture workspace for software generation**

It should combine:

- product discovery
- context orchestration
- reasoning support
- architecture planning
- phased task decomposition
- documentation output
- prompt-pack generation

## Existing Assets To Preserve

The current application already contains strong product assets that should be
kept and reoriented rather than discarded.

### Dashboard

Current role:

- entry point into manual project creation
- entry point into AI generation
- visual library of prior projects

Future role:

- project library and workspace
- starting point for raw-idea intake
- visibility into project readiness, open questions, and prompt-pack status
- visibility into phases, tasks, and expected product outcome

### AI Wizard

Current role:

- conversational flow that interviews the user and returns a filled project
  object

Future role:

- one interface into the canonical clarification engine
- adaptive questioning system
- ambiguity detector
- reasoning engine surface that fills the structured model live

### Project Editor

Current role:

- multi-step structured editor for product documentation fields

Future role:

- full manual editing mode for the canonical product context
- advanced review and override surface for AI-generated fields
- place to refine architecture, phases, assumptions, and prompt outputs

### Project View

Current role:

- polished output view of documentation

Future role:

- final documentation and prompt-pack presentation surface
- place to review product summary, architecture, phases, assumptions,
  open questions, and generated prompts
- place to visually inspect what the planned application outcome should contain

## Current Data Model Limitations

The current `Project` type is useful, but it is optimized for a classic product
spec rather than for AI context orchestration.

Today it captures:

- title and tagline
- problem statement
- personas
- competitors
- success metrics
- color palette
- user stories
- challenges
- features
- design
- testing
- deployment

This is a strong starting point, but it is missing the central objects required
for the new product direction:

- raw user idea
- inferred context
- confidence level
- assumptions
- open questions
- resolved decisions
- scope boundaries
- non-goals
- architecture recommendation
- implementation phases
- prompt pack outputs
- readiness score

## Product Requirements

### 1. Raw Idea Intake

The application must allow the user to start with a minimal input such as:

`I need to create a vehicle tracking application`

Requirements:

- The raw idea must be captured as a first-class project field.
- The system must create an immediate provisional draft from the raw idea.
- The system must infer likely domain, users, workflows, and features before
  asking follow-up questions.

### 2. Canonical Clarification Engine

The product must be powered by one canonical reasoning engine that can operate
through multiple interaction surfaces, including chat, structured editing, and
live field population.

Requirements:

- It must ask adaptive questions rather than a fixed questionnaire.
- It must ask only the highest-leverage questions first.
- It must know what information is still missing.
- It must avoid asking low-signal questions too early.
- It must fill the project structure live in front of the user as answers are
  gathered.
- It must prefer confirm/refine interactions over making the user write every
  field manually.
- It must ask questions that materially affect:
  - scope
  - target user
  - workflow
  - architecture
  - implementation phases
- It must be able to explain why a question matters.

### 3. Dual Input Model

The application must support both:

- **chat mode**
- **manual form mode**
- **live guided workspace mode**

Requirements:

- Chat must be one feature of the product, not the whole product.
- The primary product experience should be a visual workspace that can be driven
  by chat, manual editing, or AI-led live drafting.
- Both modes must write into the same canonical project context.
- AI-generated values must be editable manually.
- Manually edited values must remain visible to the AI reasoning system.
- The user must be able to switch freely between chat and structured editing.
- The user must be able to work without chat by reviewing and confirming live
  field updates directly in the workspace.
- The default experience should be: AI drafts -> fields fill live -> user
  confirms or corrects.

### 4. Canonical Project Context

DocuMaster v2 must maintain a richer project model than the current `Project`
shape.

Minimum additions required:

- rawIdea
- productSummary
- targetUsers
- nonGoals
- assumptions
- openQuestions
- resolvedDecisions
- architectureRecommendation
- implementationPhases
- promptPack
- readiness
- inferredFields
- confirmedFields

The visual product surfaces must render from this canonical model.

### 5. Visual Spec Completion

The current Project Editor and Project View should evolve into a live spec and
reasoning system.

Requirements:

- The user must see the specification update live as questions are answered.
- The user must see fields being populated in real time while the AI is working.
- The app must visually distinguish:
  - inferred data
  - confirmed data
  - missing data
  - conflicting data
- The user must be able to refine every important field manually.
- The system should minimize blank-field data entry when enough context is
  already available.

### 6. Architecture Guidance

The product must not stop at generic documentation.

Requirements:

- It must recommend an architecture direction based on the app type.
- It must suggest major components and system boundaries.
- It must capture important technical constraints that affect downstream builds.
- It must propose a practical delivery approach rather than generic technical
  text.

### 7. Phase-Based Planning

The app must explicitly break projects into phases.

Requirements:

- It must define MVP / Phase 1
- It must define later phases
- It must identify what is in scope now versus later
- It must help the user avoid generating an overbuilt first version

### 8. Task Decomposition

The app must turn large application ideas into smaller achievable work units.

Requirements:

- It must break a large application into phases.
- It must break each phase into concrete features or tasks.
- The task list must be understandable to both a founder and an engineer.
- Tasks must be sequenced in a realistic order.
- The system must distinguish between:
  - core foundation tasks
  - MVP tasks
  - expansion tasks
  - polish tasks
- The output must support downstream execution by either an AI coding agent or a
  human engineering team.

### 9. Visual Outcome Mapping

The application must help the user visually understand what will be built.

Requirements:

- It must show the expected final product structure visually.
- It must show how the app evolves phase by phase.
- It must show what the user will get in MVP versus later stages.
- It must make the outcome more tangible than plain text requirements alone.
- The user must be able to review the app plan visually before prompt generation.

## Interaction Model

The preferred interaction model for DocuMaster v2 is:

1. The user provides a rough idea.
2. The AI produces a first-pass draft immediately.
3. The AI asks the next most important question.
4. The app fills the relevant project fields live in front of the user.
5. The user confirms, corrects, or refines what the system generated.
6. The AI moves to the next critical gap.

This means the product should feel like collaborative live drafting inside a
visual workspace, not like a chat app and not like a blank form the user must
fill from scratch.

Core interaction principles:

- ask the right question
- generate a draft immediately
- fill the visible structure live
- pause for confirmation
- keep moving until the project is build-ready

## WebMCP / Live Filling Behavior

If the product uses WebMCP or a similar live browser-control mechanism, that
capability should be expressed as visible user value.

Requirements:

- The AI should update visible fields in real time while speaking with the user.
- The user should be able to watch the system populate the project.
- The user should mainly be asked to confirm, refine, or correct generated
  content.
- The user should not be forced to manually transcribe what the AI already knows
  how to draft.

This behavior is part of the intended product experience, not only a technical
implementation choice.

### 10. Prompt Pack Generation

The final deliverable must be more than one large prompt.

Minimum outputs:

- Master build prompt
- Architecture prompt
- Phase 1 MVP prompt
- Phase 2 expansion prompt
- Frontend prompt
- Backend prompt
- QA / test prompt

Requirements:

- Every prompt must be generated from the canonical project context.
- The prompt pack must reflect the current decisions and assumptions.
- The prompt pack must be versionable and reviewable.
- The prompt pack must be visible inside the application, not hidden.

### 11. Product Tracking

The app must track reasoning and project status, not just content sections.

Requirements:

- readiness score
- open questions count
- assumptions count
- decision log
- phase status
- prompt pack generation status

The Dashboard should evolve to show these meaningful signals instead of purely
decorative stats.

### 12. Documentation Output

The Project View must become the final presentation layer for:

- executive summary
- problem definition
- target users
- workflows
- feature scope
- non-goals
- assumptions
- architecture
- phases
- prompt pack
- readiness

### 13. Quality Guardrails

DocuMaster must solve common AI agent failure modes.

Requirements:

- It must detect vague or weak problem definitions.
- It must detect missing target-user clarity.
- It must detect unclear MVP boundaries.
- It must detect contradictory requirements.
- It must not produce a “final” prompt pack if critical context is missing.

## Required Question Domains

The clarification system must be able to cover these question categories:

### Problem

- What exact problem is being solved?
- Why does it matter now?
- What pain exists in the current approach?

### User

- Who is the primary user?
- Who is not the user?
- What are they doing today?

### Workflow

- What is the primary end-to-end flow?
- What is the main task the user must complete?
- What are the key screens or operational steps?

### Scope

- What must be included in v1?
- What is explicitly out of scope?
- What belongs in later phases?

### Constraints

- auth
- real-time requirements
- integrations
- devices/platforms
- reporting
- admin needs
- data ingestion
- compliance/security needs

### Delivery

- MVP-first or complete roadmap
- solo build or team handoff
- AI-builder target expectations

### Outcome

- what the final product should look like
- what screens or operational modules the app should contain
- what should be visible in MVP
- what should appear only in later phases

## Screen-Level Product Direction

### Dashboard v2

The Dashboard should change from a generic project library into a project
workspace.

It should support:

- start from raw idea
- continue an in-progress project
- see readiness status
- see unresolved questions
- see whether prompt pack is ready
- see project phases and task breakdown
- see visual outcome summaries for each project
- see confirmation progress for auto-filled project sections

It should remove or reduce:

- fake trend metrics
- decorative counts without decision value

### AI Wizard v2

The AI Wizard should become one major feature of the product, not the entire
product model.

It should:

- infer context from the initial idea
- ask adaptive questions
- explain why it is asking
- fill the structured model live
- fill visible project fields in front of the user
- stop mainly for confirmation, correction, or high-impact ambiguity
- stop when confidence and clarity are sufficient
- propose task decomposition as soon as enough clarity exists

The broader product should still work as a visual planning workspace even when
the user relies more on structured editing and confirmation than on chat.

### Project Editor v2

The Project Editor should become the structured override system.

It should add sections for:

- assumptions
- open questions
- non-goals
- architecture
- phases
- task breakdown
- outcome preview
- prompt pack review
- confirmation status for inferred content

### Project View v2

The Project View should become the final “project package” screen.

It should present:

- final documentation
- architecture summary
- implementation phases
- achievable tasks
- expected product outcome
- prompt pack
- decision history
- readiness state

## Key Example User Journey

### Input

The user types:

`I need to create a vehicle tracking application`

### System Draft

The app should infer likely defaults such as:

- business product rather than generic consumer app
- likely users: fleet managers, operators, admins
- likely workflows: live location, route history, alerts, reporting
- likely constraints: map integration, real-time or scheduled updates,
  tracking source, admin needs

### Follow-Up Questions

The app should then ask only high-value questions such as:

- Is this for businesses, schools, delivery fleets, rentals, or personal users?
- Do you need real-time tracking or periodic updates?
- Are you integrating hardware GPS devices, mobile phones, or both?
- What matters most in v1: live map, route history, alerts, reporting, admin?

### Final Output

The user should end with:

- a complete visual product spec
- architecture guidance
- phase breakdown
- concrete task breakdown
- a visual understanding of what the application outcome should be
- prompt pack usable by an AI app-building agent
- confidence that the system filled most of the project correctly and only asked
  for important confirmations

## Non-Goals

DocuMaster v2 should not attempt to:

- fully build and host the final application itself
- become a general collaboration suite in the first phase
- optimize for decorative UI over reasoning quality
- produce only one universal prompt as the final output
- replace execution planning with only abstract documentation

## Success Criteria

DocuMaster v2 succeeds if:

- a user can start from a vague idea and reach a build-ready project package
  without already knowing how to prompt an LLM
- the AI Wizard asks materially better questions than the user would have asked
  alone
- users who prefer not to work in chat can still complete and validate the
  project effectively through the visual workspace
- the resulting prompt pack produces better downstream AI build results than the
  raw idea alone
- the user can clearly identify MVP scope, later phases, and non-goals
- the app visibly tracks assumptions, open questions, and readiness
- the app can break a large application into smaller achievable tasks
- the user can visually understand what will be built before generation begins

## Final Consolidated Requirements For This Application

This application should become:

- an AI-first context orchestration engine
- a visual product architecture and planning workspace
- built on top of the existing Dashboard, AI Wizard, Project Editor, and Project
  View
- capable of starting from a single raw idea
- capable of collecting missing information intelligently
- capable of filling the entire project visually
- capable of filling the project live in front of the user while the AI asks
  questions
- capable of making confirmation the user's main action instead of large-scale
  manual typing
- capable of working as a visual planning workspace where chat is optional, not
  mandatory
- capable of preserving architecture and reasoning state
- capable of breaking large products into small achievable phases and tasks
- capable of visually showing the expected outcome of the planned application
- capable of producing the strongest possible build-ready prompt pack

In short:

**DocuMaster should stop being only a software documentation builder and become
the visual AI product architecture, planning, and prompt-preparation system that
helps users go from vague idea to build-ready execution context.**
