# DocuMaster v2 UX Flow Spec

## Purpose

This document translates the v2 PRD into a screen and interaction model that
fits the current codebase.

Current app surfaces:

- `Dashboard`
- `AIWizard`
- `ProjectEditor`
- `ProjectView`
- top-level routing and state in `App.tsx`

The goal is to evolve these screens without discarding the existing structure.

## UX Principles

- The user starts with a vague idea, not a complete brief.
- The AI fills the workspace live in front of the user.
- The user mainly confirms, corrects, and refines.
- Chat is one feature, not the entire experience.
- The workspace should always show structured progress, not only conversation.
- The user should be able to visually understand what will be built before any
  prompt pack is finalized.

## New Product Structure

The current `viewMode` values are:

- `dashboard`
- `view`
- `edit`
- `ai-wizard`

For v2, the mental model should become:

- `dashboard`
- `workspace`
- `package`

Suggested future mapping:

- `dashboard` stays the entry point
- `ai-wizard` and `edit` merge conceptually into `workspace`
- `view` evolves into `package`

## Screen 1: Dashboard v2

### Purpose

The Dashboard becomes a workspace launcher and project progress overview.

### Current Strengths to Keep

- clear entry points for manual and AI generation
- recent projects library
- visually strong project cards

### Current Weaknesses to Fix

- decorative project metrics are not decision-useful
- search is currently only visual
- cards do not expose readiness, open questions, or prompt-pack status

### New Core Areas

#### A. Start Area

Primary actions:

- `Start with an Idea`
- `Open Workspace`
- `Continue Last Project`

The default CTA should no longer feel split only between “Manual Project” and
“Generate with AI”. Instead it should feel like one product with multiple ways
to begin.

Recommended CTA set:

- `Start from Idea`
- `Chat Assist`
- `Manual Workspace`

#### B. Workspace Status Grid

Replace decorative stats with:

- projects in clarification
- projects ready for review
- prompt packs ready
- unresolved high-impact questions

#### C. Project Cards

Each project card should show:

- project title
- one-line summary
- readiness level
- current phase
- open questions count
- prompt pack readiness
- last updated

#### D. Outcome Preview Teaser

Each project card should preview:

- number of planned phases
- number of task groups
- expected screens/modules

## Screen 2: Workspace v2

This is the main product surface.

It should replace the current split between AI Wizard and Project Editor.

### Purpose

Allow the AI and the user to collaboratively build the project context live.

### Layout

Recommended 3-panel workspace:

#### Left Panel: Project Map

Shows sections and completeness:

- Idea
- Problem
- Users
- Workflow
- Scope
- Architecture
- Phases
- Tasks
- Outcome
- Prompt Pack

Each section should show:

- status: missing / drafted / confirmed / conflicted
- readiness indicator

This panel is the evolution of the current Project Editor section navigation.

#### Center Panel: Structured Workspace

Shows the current section’s fields live.

This is where the app visibly fills in front of the user.

Expected behavior:

- AI answers update fields here in real time
- user sees generated values appear immediately
- each generated block shows:
  - inferred
  - confirmed
  - needs review

This panel evolves from the current Project Editor form.

#### Right Panel: AI Assistant / Confirmation Feed

This is the evolution of the current AI Wizard.

Its purpose is not to be the whole product. Its purpose is to:

- ask the next best question
- explain why it matters
- request confirmation on generated content
- resolve ambiguity

### Interaction Model

Default loop:

1. User gives raw idea
2. AI drafts key fields
3. Workspace fills live
4. AI asks for confirmation or correction
5. User confirms or edits
6. AI moves to next critical gap

### Workspace Sections

#### 1. Idea

Fields:

- raw idea
- generated title
- generated one-line summary
- project category

#### 2. Problem

Fields:

- problem statement
- why now
- pain points
- current alternatives
- business impact

#### 3. Users

Fields:

- primary user
- secondary users
- excluded users
- goals
- frustrations

#### 4. Workflow

Fields:

- primary workflow
- key steps
- success outcome

#### 5. Scope

Fields:

- must-have
- should-have
- later
- non-goals

#### 6. Architecture

Fields:

- application type
- major components
- key constraints
- recommended stack
- tradeoffs

#### 7. Phases

Fields:

- phase 1 MVP
- phase 2 expansion
- phase 3 polish / scale

#### 8. Tasks

Fields:

- foundation tasks
- MVP tasks
- expansion tasks
- polish tasks

This section is essential because the product must break large applications
into achievable work.

#### 9. Outcome

Fields:

- expected screens
- expected modules
- MVP outcome preview
- later-phase outcome preview

This section makes the planned application tangible.

#### 10. Prompt Pack

Fields:

- master prompt
- architecture prompt
- phase prompts
- frontend prompt
- backend prompt
- QA prompt

## AI Behavior in Workspace

### What the AI should do

- infer first draft values
- fill fields live
- ask only high-value questions
- ask for confirmation after meaningful updates
- keep track of what is still missing

### What the AI should not do

- force the user to fill a giant blank form
- ask every possible question up front
- hide generated state from the user
- behave like a chat app detached from the actual workspace

## Screen 3: Package View v2

This evolves from the current `ProjectView`.

### Purpose

Present the final project package after clarification and structuring are
complete.

### Contents

#### A. Product Summary

- title
- one-line summary
- readiness state
- current phase

#### B. Problem and Users

- problem statement
- business impact
- target users

#### C. Scope and Features

- must-have features
- later-phase features
- non-goals

#### D. Architecture

- architecture summary
- major components
- stack recommendation
- important constraints

#### E. Implementation Plan

- phases
- grouped tasks
- dependencies

#### F. Outcome Preview

- planned screens
- planned modules
- MVP outcome

#### G. Prompt Pack

- prompt list
- copy / export actions

#### H. Assumptions and Decisions

- active assumptions
- open questions
- resolved decisions

### Current ProjectView Mapping

Preserve and evolve:

- `Problem Statement` -> product problem section
- `Business Impact` -> stays
- `Target Audience` -> becomes target users block
- `Key Features` -> becomes scope/features block
- `Tech Stack` -> becomes architecture block
- `User Stories` -> can remain as supporting output, not the primary planning
  object
- `QA Strategy` -> should move under prompt pack / implementation package

De-emphasize or rework:

- fake export flow
- decorative documentation hero without readiness value
- static branding-first emphasis

## Main User Flows

### Flow A: Start From Raw Idea

1. User opens Dashboard
2. User clicks `Start from Idea`
3. User types a rough product intent
4. App opens Workspace
5. AI drafts the first product structure
6. User confirms or edits
7. AI continues filling gaps
8. App reaches builder-ready state
9. User opens Package View and copies/export prompts

### Flow B: Use Chat Assist

1. User opens Dashboard
2. User clicks `Chat Assist`
3. Workspace opens with chat panel active
4. AI drives clarification and field filling
5. User confirms generated content
6. Package View becomes available when readiness is high enough

### Flow C: Manual Workspace

1. User opens Dashboard
2. User clicks `Manual Workspace`
3. Workspace opens with editor panel focus
4. AI still offers suggestions and confirmations
5. User edits directly
6. Prompt pack is generated from the same canonical model

## Confirmation UX

This is central to the v2 experience.

### Confirmation Actions

Every important AI-generated block should support:

- `Confirm`
- `Edit`
- `Regenerate`
- `Defer`

### Confirmation Rules

- High-confidence low-risk drafts can be grouped into bulk confirmation.
- High-impact fields should ask for explicit confirmation.
- Critical ambiguity should block prompt-pack completion.

Examples of high-impact fields:

- target user
- MVP scope
- primary workflow
- architecture direction
- phase 1 contents

## WebMCP / Live Fill UX

If WebMCP or similar browser-control tooling is used:

- the user should see fields update live in the workspace
- the system should visibly navigate to relevant sections when asking
  confirmation
- the AI should feel like a live collaborator editing the same workspace

This should be a visible UX signature of the product.

## Visual Status System

Every major section should support:

- `Missing`
- `Drafted`
- `Needs Confirmation`
- `Confirmed`
- `Conflicted`

Project-level statuses:

- `Draft`
- `Clarifying`
- `Structuring`
- `Ready for Review`
- `Prompt Pack Ready`
- `Approved`

## Mapping to Current Components

### `App.tsx`

Current:

- controls `dashboard`, `view`, `edit`, `ai-wizard`

V2 direction:

- evolve toward `dashboard`, `workspace`, `package`

### `Dashboard.tsx`

Current:

- project list
- manual entry
- AI entry

V2 direction:

- idea intake launcher
- project readiness overview
- task / phase / outcome previews

### `AIWizard.tsx`

Current:

- stand-alone chat flow that creates a full `Project`

V2 direction:

- docked or integrated assistant panel
- clarification engine surface
- live fill + confirmation engine

### `ProjectEditor.tsx`

Current:

- multi-step form over legacy documentation fields

V2 direction:

- workspace center panel
- section-based review and override editor
- support for assumptions, phases, tasks, outcome preview, prompts

### `ProjectView.tsx`

Current:

- polished documentation presentation

V2 direction:

- final project package
- architecture, tasks, prompts, readiness, and outcome view

## Recommended Implementation Order

### Stage 1

- Introduce v2 data model alongside current `Project`
- Add raw idea, assumptions, open questions, readiness, prompt pack, phases

### Stage 2

- Rework AI Wizard into a live-fill clarification surface
- Show inferred vs confirmed field state in editor

### Stage 3

- Introduce workspace layout merging AI Wizard + Project Editor concepts
- Add task decomposition and outcome preview sections

### Stage 4

- Rework Project View into Package View
- Make prompt pack and implementation phases first-class outputs

### Stage 5

- Rework Dashboard around readiness, phase/task visibility, and project package
  discovery

## Final UX Outcome

The product should feel like this:

- not a chat app
- not a blank form
- not only a documentation viewer

It should feel like:

**a live visual planning workspace where AI asks the right question, fills the
project in front of the user, breaks the work into achievable pieces, and
prepares the final prompt pack for application generation**
