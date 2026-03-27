---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **App shell**: `App.tsx`, `index.tsx`, `vite.config.ts` at repository root
- **Domain contract**: `types.ts`, `mockData.ts` at repository root
- **UI surfaces**: `components/`
- **Specs**: `specs/[###-feature-name]/`
- **Tests**: `tests/` only if this feature adds automated coverage

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Review affected surfaces and target files in `specs/[###-feature-name]/plan.md`
- [ ] T002 Update dependencies or environment wiring in `package.json`, `.env.local`, or `vite.config.ts` if required
- [ ] T003 [P] Create any new shared modules or directories approved in the implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks for this app (adjust per feature):

- [ ] T004 Update the canonical `Project` schema in `types.ts`
- [ ] T005 [P] Sync seeded or default project content in `mockData.ts`
- [ ] T006 [P] Sync AI function schema and normalization logic in `components/AIWizard.tsx`
- [ ] T007 Update shared application state or routing in `App.tsx`
- [ ] T008 Add any shared loading, empty, or error states needed by all affected surfaces
- [ ] T009 Document feature-specific setup or workflow changes in `README.md` if required

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Add coverage for the user journey in `tests/[area]/[name].test.[ts|tsx]`
- [ ] T011 [P] [US1] Add integration coverage for the affected flow in `tests/[area]/[name].test.[ts|tsx]`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement dashboard or navigation changes in `components/[Component].tsx`
- [ ] T013 [P] [US1] Implement editor or AI-wizard changes in `components/[Component].tsx`
- [ ] T014 [US1] Implement shared app-state updates in `App.tsx` or a new shared module
- [ ] T015 [US1] Implement project review or export changes in `components/[Component].tsx`
- [ ] T016 [US1] Add validation, guardrails, and user messaging for this story
- [ ] T017 [US1] Record manual verification steps in `specs/[###-feature-name]/quickstart.md`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Add coverage for the user journey in `tests/[area]/[name].test.[ts|tsx]`
- [ ] T019 [P] [US2] Add integration coverage for the affected flow in `tests/[area]/[name].test.[ts|tsx]`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement the affected UI surface in `components/[Component].tsx`
- [ ] T021 [US2] Update cross-surface state flow in `App.tsx` or shared helpers
- [ ] T022 [US2] Implement supporting schema or seed updates in `types.ts` or `mockData.ts`
- [ ] T023 [US2] Integrate the story with previously delivered surfaces without breaking independent testability

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Add coverage for the user journey in `tests/[area]/[name].test.[ts|tsx]`
- [ ] T025 [P] [US3] Add integration coverage for the affected flow in `tests/[area]/[name].test.[ts|tsx]`

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement the affected UI surface in `components/[Component].tsx`
- [ ] T027 [US3] Update shared state, schema, or AI generation wiring as required
- [ ] T028 [US3] Add finishing behavior, validation, and documentation for this story

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Refresh product/setup documentation in `README.md` and relevant spec files
- [ ] TXXX Code cleanup and refactoring across touched files
- [ ] TXXX Review bundle or runtime impact for newly added dependencies or flows
- [ ] TXXX [P] Add or expand automated tests if requested in the feature spec
- [ ] TXXX Run `npm run build`
- [ ] TXXX Validate `specs/[###-feature-name]/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Add coverage for the user journey in tests/[area]/[name].test.[ts|tsx]"
Task: "Add integration coverage for the affected flow in tests/[area]/[name].test.[ts|tsx]"

# Launch independent UI work for User Story 1 together:
Task: "Implement dashboard or navigation changes in components/[Component].tsx"
Task: "Implement editor or AI-wizard changes in components/[Component].tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- For DocuMaster content changes, include schema-sync tasks before story-level implementation
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
