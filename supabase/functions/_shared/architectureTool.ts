// Shared Gemini function-calling schema for a system architecture diagram.
// Used by both the gemini-chat (full project generation) and
// generate-architecture (standalone "Suggest with AI" on the Architecture
// step) edge functions so the two stay in sync.
import { Type } from 'npm:@google/genai@^1.31.0';

export const ARCH_NODE_TYPE_VALUES = [
  'client',
  'frontend',
  'backend',
  'api',
  'database',
  'cache',
  'queue',
  'auth',
  'storage',
  'external',
] as const;

export const architectureSchema = {
  type: Type.OBJECT,
  description: 'A system architecture diagram: the major components of the application and how they connect.',
  properties: {
    nodes: {
      type: Type.ARRAY,
      description: 'Major architecture components (5-10 is typical). Give each a short, stable, unique id (e.g. "frontend", "api", "db").',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Short unique id, e.g. "frontend" or "db"' },
          type: { type: Type.STRING, enum: [...ARCH_NODE_TYPE_VALUES] },
          label: { type: Type.STRING, description: 'Human-readable name, e.g. "React Frontend"' },
          description: { type: Type.STRING, description: 'One short sentence on this component\'s responsibility' },
        },
        required: ['id', 'type', 'label'],
      },
    },
    edges: {
      type: Type.ARRAY,
      description: 'Connections between components, referencing node ids.',
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          target: { type: Type.STRING },
          label: { type: Type.STRING, description: 'Optional short label, e.g. "REST", "reads/writes"' },
        },
        required: ['source', 'target'],
      },
    },
  },
  required: ['nodes', 'edges'],
};
