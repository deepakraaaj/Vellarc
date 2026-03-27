# SpecArc v2 Data Model

## Purpose

This document defines the v2 canonical data model for SpecArc based on the
current application structure in:

- `types.ts`
- `App.tsx`
- `components/AIWizard.tsx`
- `components/ProjectEditor.tsx`
- `components/ProjectView.tsx`

The goal is not to throw away the current `Project` model. The goal is to
extend it so the app can evolve from a documentation builder into a visual AI
product architecture and prompt-preparation workspace.

## Current Model Summary

The current `Project` model stores:

- title and tagline
- project status
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

This is useful for a documentation object, but insufficient for the intended v2
experience because it does not model:

- the original raw idea
- inferred vs confirmed fields
- AI clarification progress
- assumptions
- open questions
- resolved decisions
- non-goals
- architecture planning
- implementation phases
- task breakdown
- outcome preview
- prompt packs
- readiness tracking

## Modeling Principles

- `ProjectV2` is the single source of truth across dashboard, AI workspace,
  manual editor, and final project package view.
- Chat, manual editing, and live guided filling must all write into the same
  canonical object.
- Every generated field should preserve provenance:
  - inferred by AI
  - confirmed by user
  - edited manually
- The model should support both current documentation output and new v2
  planning/output surfaces.
- The model should be UI-friendly for live updates.

## Top-Level Entity

```ts
type ProjectStatus =
  | "Draft"
  | "Clarifying"
  | "Structuring"
  | "Ready for Review"
  | "Prompt Pack Ready"
  | "Approved";

type GenerationMode = "manual" | "chat" | "hybrid";

type ConfidenceLevel = "low" | "medium" | "high";

interface ProjectV2 {
  id: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  generationMode: GenerationMode;
  title: string;
  oneLineSummary: string;
  rawIdea: string;
  readiness: ReadinessState;
  provenance: ProvenanceMap;
  intake: IntakeState;
  product: ProductDefinition;
  planning: PlanningDefinition;
  outputs: ProjectOutputs;
  workspace: WorkspaceState;
  visualIdentity: VisualIdentity;
  legacyDocumentation: LegacyDocumentation;
}
```

## Readiness State

This powers the future dashboard and package view.

```ts
interface ReadinessState {
  score: number; // 0-100
  level: "not-ready" | "needs-clarification" | "review-ready" | "builder-ready";
  blockers: string[];
  warnings: string[];
  lastEvaluatedAt: string;
}
```

## Provenance

This is critical for the v2 interaction model where the AI fills fields live and
the user mostly confirms or corrects.

```ts
type FieldSource = "user" | "ai-inferred" | "ai-generated" | "manually-edited";

type FieldStatus = "missing" | "drafted" | "confirmed" | "conflicted" | "deferred";

interface ProvenanceEntry {
  source: FieldSource;
  status: FieldStatus;
  confidence?: ConfidenceLevel;
  updatedAt: string;
}

type ProvenanceMap = Record<string, ProvenanceEntry>;
```

Example keys:

- `product.problem.statement`
- `planning.phases[0].name`
- `outputs.promptPack.masterPrompt`

## Intake State

Tracks the first idea and the clarification session state.

```ts
interface IntakeState {
  initialIdeaCaptured: boolean;
  firstDraftGenerated: boolean;
  currentMode: "chat" | "manual" | "workspace";
  activeQuestionId?: string;
  askedQuestionIds: string[];
  answeredQuestionIds: string[];
  confirmationQueue: ConfirmationItem[];
}

interface ConfirmationItem {
  id: string;
  fieldPath: string;
  prompt: string;
  proposedValue: string;
  reason: string;
  confidence: ConfidenceLevel;
}
```

## Product Definition

This is the main product-thinking object and should replace the current
documentation-first center of gravity.

```ts
interface ProductDefinition {
  summary: string;
  category: string;
  targetUsers: UserType[];
  excludedUsers: string[];
  problem: ProblemDefinition;
  workflows: WorkflowDefinition[];
  scope: ScopeDefinition;
  requirements: RequirementsDefinition;
  assumptions: Assumption[];
  openQuestions: OpenQuestion[];
  decisions: Decision[];
  competitors: CompetitorInsight[];
  successMetrics: SuccessMetricV2[];
  risks: RiskItem[];
}
```

### Problem Definition

```ts
interface ProblemDefinition {
  statement: string;
  whyNow: string;
  painPoints: string[];
  currentAlternatives: string[];
  businessImpact: string;
}
```

### User Types

This extends current personas into something more useful for planning.

```ts
interface UserType {
  id: string;
  name: string;
  role: string;
  primary: boolean;
  goals: string[];
  frustrations: string[];
  currentWorkflow?: string;
}
```

### Workflow Definition

Needed for outcome mapping and downstream prompt quality.

```ts
interface WorkflowDefinition {
  id: string;
  name: string;
  primary: boolean;
  trigger: string;
  steps: string[];
  successOutcome: string;
}
```

### Scope Definition

Explicit MVP boundary control.

```ts
interface ScopeDefinition {
  mustHave: ScopeItem[];
  shouldHave: ScopeItem[];
  laterPhase: ScopeItem[];
  nonGoals: string[];
}

interface ScopeItem {
  id: string;
  name: string;
  description: string;
  rationale?: string;
}
```

### Requirements Definition

```ts
interface RequirementsDefinition {
  functional: RequirementItem[];
  constraints: ConstraintItem[];
  integrations: IntegrationItem[];
  rolesAndPermissions: PermissionModel[];
}

interface RequirementItem {
  id: string;
  name: string;
  description: string;
  priority: "must" | "should" | "could";
}

interface ConstraintItem {
  id: string;
  type:
    | "platform"
    | "security"
    | "performance"
    | "compliance"
    | "delivery"
    | "business";
  description: string;
}

interface IntegrationItem {
  id: string;
  name: string;
  purpose: string;
  requiredInPhase: string;
}

interface PermissionModel {
  id: string;
  role: string;
  permissions: string[];
}
```

### Assumptions, Questions, Decisions

These are missing in the current app and are central to v2.

```ts
interface Assumption {
  id: string;
  statement: string;
  confidence: ConfidenceLevel;
  status: "active" | "validated" | "rejected";
}

interface OpenQuestion {
  id: string;
  question: string;
  impact: "high" | "medium" | "low";
  status: "open" | "answered" | "deferred";
}

interface Decision {
  id: string;
  title: string;
  description: string;
  rationale: string;
  decidedAt: string;
}
```

### Competitive and Risk Objects

```ts
interface CompetitorInsight {
  id: string;
  name: string;
  strengths: string;
  weaknesses: string;
  implication?: string;
}

interface SuccessMetricV2 {
  id: string;
  metric: string;
  target: string;
  phase?: string;
}

interface RiskItem {
  id: string;
  title: string;
  description: string;
  mitigation?: string;
}
```

## Planning Definition

This is new and powers the “break large apps into achievable tasks” requirement.

```ts
interface PlanningDefinition {
  architecture: ArchitecturePlan;
  phases: ImplementationPhase[];
  taskGroups: TaskGroup[];
  outcomePreview: OutcomePreview;
}
```

### Architecture Plan

```ts
interface ArchitecturePlan {
  summary: string;
  applicationType: string;
  majorComponents: ArchitectureComponent[];
  dataModelSummary: string[];
  recommendedStack: StackRecommendation;
  tradeoffs: string[];
}

interface ArchitectureComponent {
  id: string;
  name: string;
  purpose: string;
  phase: string;
}

interface StackRecommendation {
  frontend?: string[];
  backend?: string[];
  infra?: string[];
  notes?: string[];
}
```

### Implementation Phases

```ts
interface ImplementationPhase {
  id: string;
  name: string;
  goal: string;
  includes: string[];
  excludes: string[];
  successCriteria: string[];
  status: "planned" | "ready" | "in-progress" | "complete";
}
```

### Task Groups

These are intentionally product-facing, not only engineering-facing.

```ts
interface TaskGroup {
  id: string;
  phaseId: string;
  label: string;
  type: "foundation" | "mvp" | "expansion" | "polish";
  tasks: PlannedTask[];
}

interface PlannedTask {
  id: string;
  title: string;
  description: string;
  ownerType: "founder" | "product" | "design" | "engineering" | "ai-builder";
  status: "pending" | "ready" | "done";
  dependsOn?: string[];
}
```

### Outcome Preview

Needed because the user wants to visually see what will be built.

```ts
interface OutcomePreview {
  screenMap: ScreenPreview[];
  moduleMap: ModulePreview[];
  mvpPreviewSummary: string;
}

interface ScreenPreview {
  id: string;
  name: string;
  purpose: string;
  phaseId: string;
}

interface ModulePreview {
  id: string;
  name: string;
  purpose: string;
  phaseId: string;
}
```

## Outputs

This replaces the current pattern where the app mainly ends in a documentation
view.

```ts
interface ProjectOutputs {
  docs: DocumentationOutput;
  promptPack: PromptPack;
  exportState: ExportState;
}
```

### Documentation Output

```ts
interface DocumentationOutput {
  executiveSummary: string;
  productBrief: string;
  architectureSummary: string;
  phaseSummary: string;
}
```

### Prompt Pack

```ts
interface PromptPack {
  version: number;
  masterPrompt: PromptArtifact;
  architecturePrompt: PromptArtifact;
  phasePrompts: PromptArtifact[];
  frontendPrompt?: PromptArtifact;
  backendPrompt?: PromptArtifact;
  qaPrompt?: PromptArtifact;
}

interface PromptArtifact {
  id: string;
  name: string;
  objective: string;
  prompt: string;
  generatedAt: string;
}
```

### Export State

```ts
interface ExportState {
  availableFormats: ("markdown" | "json" | "prompt-pack" | "pdf")[];
  lastExportedAt?: string;
}
```

## Workspace State

This supports the future visual workspace and current screen transitions.

```ts
interface WorkspaceState {
  activeSurface: "dashboard" | "workspace" | "package";
  activePanel: "chat" | "editor" | "preview" | "prompts";
  activeSection:
    | "intake"
    | "problem"
    | "users"
    | "workflow"
    | "scope"
    | "architecture"
    | "phases"
    | "tasks"
    | "outcome"
    | "prompts";
}
```

## Visual Identity

This preserves the existing color and design fields but lowers their priority
from being central product data.

```ts
interface VisualIdentity {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  philosophy?: string;
  principles?: string[];
  wireframesUrl?: string;
  mockupsUrl?: string;
}
```

## Legacy Documentation

This keeps compatibility with the current app’s presentational sections.

```ts
interface LegacyDocumentation {
  userStories: LegacyUserStory[];
  features: LegacyFeature[];
  challenges: LegacyChallenge[];
  testing: LegacyTesting;
  deployment: LegacyDeployment;
}
```

These can be mostly migrated from the current `types.ts` definitions.

## Current-to-V2 Mapping

### Preserve with minor rename

- `title` -> `title`
- `tagline` -> `oneLineSummary`
- `personas` -> `product.targetUsers`
- `competitors` -> `product.competitors`
- `successMetrics` -> `product.successMetrics`
- `colorPalette` -> `visualIdentity.colorPalette`
- `design` -> `visualIdentity`

### Preserve under legacy compatibility

- `userStories` -> `legacyDocumentation.userStories`
- `features` -> `legacyDocumentation.features`
- `challenges` -> `legacyDocumentation.challenges`
- `testing` -> `legacyDocumentation.testing`
- `deployment` -> `legacyDocumentation.deployment`

### New required objects

- `rawIdea`
- `readiness`
- `provenance`
- `intake`
- `product.scope`
- `product.assumptions`
- `product.openQuestions`
- `product.decisions`
- `planning.architecture`
- `planning.phases`
- `planning.taskGroups`
- `planning.outcomePreview`
- `outputs.promptPack`

## Migration Strategy

### Phase 1

Add new v2 fields while keeping the current `Project` rendering path functional.

### Phase 2

Route Dashboard and AI Wizard to the new intake / readiness / prompt-pack fields.

### Phase 3

Move Project Editor sections from documentation-first to workspace-first.

### Phase 4

Move Project View from pure documentation output to full project package output.

## Minimal Viable Schema Upgrade

If full migration is too large for one implementation phase, the minimum useful
upgrade is:

- add `rawIdea`
- add `assumptions`
- add `openQuestions`
- add `resolvedDecisions`
- add `implementationPhases`
- add `taskGroups`
- add `promptPack`
- add `readiness`
- add `provenance`

That minimum set is enough to make the current app meaningfully closer to the
intended v2 product.
