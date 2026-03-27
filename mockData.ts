import { Project } from './types';

export const initialProject: Project = {
  id: '1',
  title: 'TaskFlow Pro - 1',
  tagline: 'Intelligent task management that adapts to your team\'s workflow',
  status: 'In Review',
  lastUpdated: 'September 30, 2023',
  problemStatement: {
    overview: 'Modern teams struggle with fragmented task management tools that don\'t adapt to their unique workflows. Context switching between multiple apps leads to missed deadlines and communication gaps.',
    painPoints: [
      'Tasks scattered across email, Slack, and standalone tools',
      'No visibility into team workload and capacity',
      'Difficulty prioritizing when everything feels urgent'
    ],
    impact: 'Teams waste 30% of their time managing tasks instead of completing them. Project delays and burnout are increasingly common.'
  },
  personas: [
    {
      id: 'p1',
      name: 'Sarah the Project Manager',
      role: 'Senior PM at a 50-person tech company',
      goals: 'Needs real-time visibility into all projects, wants to prevent team burnout by balancing workload.',
      frustrations: 'Current tools don\'t show the full picture. Has to manually check in with everyone daily.'
    },
    {
      id: 'p2',
      name: 'David the Developer',
      role: 'Full-stack developer on multiple projects',
      goals: 'Wants a simple way to see what\'s next, needs to minimize context switching.',
      frustrations: 'Gets pinged on Slack constantly about task status. Hard to focus on deep work.'
    }
  ],
  competitors: [
    {
      id: 'c1',
      name: 'Jira',
      strengths: 'Extremely customizable, industry standard.',
      weaknesses: 'Clunky UI, steep learning curve, slow performance.'
    },
    {
      id: 'c2',
      name: 'Trello',
      strengths: 'Simple, visual, easy to start.',
      weaknesses: 'Lacks depth for complex engineering workflows, poor reporting.'
    }
  ],
  successMetrics: [
    {
      id: 'm1',
      metric: 'User Activation Rate',
      target: '40% of signups complete onboard within 24h'
    },
    {
      id: 'm2',
      metric: 'Weekly Active Users',
      target: '1,500 WAUs by Q4'
    }
  ],
  colorPalette: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    background: '#F8FAFC',
    text: '#1E293B'
  },
  userStories: [
    {
      id: 'us1',
      role: 'project manager',
      goal: 'see all team tasks in one dashboard with workload indicators',
      benefit: 'I can prevent overload and redistribute work before anyone burns out',
      priority: 'Must Have'
    },
    {
      id: 'us2',
      role: 'developer',
      goal: 'automatic task prioritization based on deadlines and dependencies',
      benefit: 'I always know what to work on next without asking',
      priority: 'Must Have'
    }
  ],
  challenges: [
    {
      id: 'ch1',
      title: 'Real-time synchronization across devices',
      description: 'Ensuring that task updates are reflected instantly for all users without lag is difficult with current WebSocket limitations.',
      solution: 'Implement optimistic UI updates and a custom sync engine using CRDTs (Conflict-free Replicated Data Types).'
    }
  ],
  features: [
    {
      id: 'f1',
      name: 'Smart Workload Balancing',
      status: 'In Progress',
      description: 'AI-powered workload visualization that highlights team members at capacity and suggests task redistribution.',
      benefit: 'Prevents burnout and ensures work is evenly distributed.'
    },
    {
      id: 'f2',
      name: 'Intelligent Prioritization',
      status: 'Planned',
      description: 'Automatically orders tasks based on deadlines, dependencies, and team goals.',
      benefit: 'Eliminates decision fatigue about what to work on next.'
    }
  ],
  design: {
    philosophy: 'Minimalist, focus-driven interface that fades into the background.',
    principles: ['"Mobile-first approach"', '"Accessibility is priority"', '"Minimize cognitive load"'],
    wireframesUrl: 'https://figma.com/proto/xyz...',
    mockupsUrl: 'https://figma.com/file/abc...'
  },
  testing: {
    strategy: 'Automated E2E tests for critical paths, unit tests for all business logic.',
    cases: [
      { id: 'tc1', name: 'User can create and save a task', description: 'Enter task title, assign user, click save.', expected: 'Task appears in list, database updated.' }
    ]
  },
  deployment: {
    platform: 'Vercel / AWS RDS',
    strategy: 'CI/CD pipeline via GitHub Actions. Staging environment for PR reviews.',
    environment: 'Node.js 18, PostgreSQL, Redis'
  }
};
