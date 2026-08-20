
export type ProjectStatus = 'Draft' | 'In Review' | 'Approved' | 'Total';

export interface Persona {
  id: string;
  name: string;
  role: string;
  goals: string;
  frustrations: string;
}

export interface UserStory {
  id: string;
  role: string;
  goal: string;
  benefit: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have';
}

export interface Feature {
  id: string;
  name: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  description: string;
  benefit: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  solution: string;
}

export interface Competitor {
  id: string;
  name: string;
  strengths: string;
  weaknesses: string;
}

export interface SuccessMetric {
  id: string;
  metric: string;
  target: string;
}

export type ArchitectureNodeType =
  | 'client'
  | 'frontend'
  | 'backend'
  | 'api'
  | 'database'
  | 'cache'
  | 'queue'
  | 'auth'
  | 'storage'
  | 'external';

export interface ArchitectureNode {
  id: string;
  type: ArchitectureNodeType;
  label: string;
  description?: string;
  position: { x: number; y: number };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Architecture {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  lastUpdated: string;
  problemStatement: {
    overview: string;
    painPoints: string[];
    impact: string;
  };
  personas: Persona[];
  competitors: Competitor[];
  successMetrics: SuccessMetric[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  userStories: UserStory[];
  challenges: Challenge[];
  features: Feature[];
  design: {
    philosophy: string;
    principles: string[];
    wireframesUrl: string;
    mockupsUrl: string;
  };
  architecture?: Architecture;
  testing: {
    strategy: string;
    cases: { id: string; name: string; description: string; expected: string }[];
  };
  deployment: {
    platform: string;
    strategy: string;
    environment: string;
  };
}

export type ViewMode = 'dashboard' | 'view' | 'edit';
