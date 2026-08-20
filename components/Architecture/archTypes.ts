import {
  Smartphone,
  AppWindow,
  Server,
  Waypoints,
  Database,
  Zap,
  ListOrdered,
  ShieldCheck,
  HardDrive,
  Globe,
} from 'lucide-react';
import { ArchitectureNodeType } from '../../types';

export interface ArchNodeTypeConfig {
  type: ArchitectureNodeType;
  label: string;
  defaultLabel: string;
  icon: typeof Server;
  accent: string; // tailwind color name, e.g. 'indigo'
}

export const ARCH_NODE_TYPES: ArchNodeTypeConfig[] = [
  { type: 'client', label: 'Client', defaultLabel: 'Client App', icon: Smartphone, accent: 'sky' },
  { type: 'frontend', label: 'Frontend', defaultLabel: 'Frontend', icon: AppWindow, accent: 'indigo' },
  { type: 'backend', label: 'Backend', defaultLabel: 'Backend Service', icon: Server, accent: 'violet' },
  { type: 'api', label: 'API', defaultLabel: 'API Gateway', icon: Waypoints, accent: 'cyan' },
  { type: 'database', label: 'Database', defaultLabel: 'Database', icon: Database, accent: 'emerald' },
  { type: 'cache', label: 'Cache', defaultLabel: 'Cache', icon: Zap, accent: 'amber' },
  { type: 'queue', label: 'Queue', defaultLabel: 'Message Queue', icon: ListOrdered, accent: 'orange' },
  { type: 'auth', label: 'Auth', defaultLabel: 'Auth Service', icon: ShieldCheck, accent: 'rose' },
  { type: 'storage', label: 'Storage', defaultLabel: 'File Storage', icon: HardDrive, accent: 'slate' },
  { type: 'external', label: 'External', defaultLabel: 'External Service', icon: Globe, accent: 'fuchsia' },
];

const CONFIG_BY_TYPE: Record<ArchitectureNodeType, ArchNodeTypeConfig> = ARCH_NODE_TYPES.reduce(
  (acc, cfg) => ({ ...acc, [cfg.type]: cfg }),
  {} as Record<ArchitectureNodeType, ArchNodeTypeConfig>
);

export function getArchNodeConfig(type: ArchitectureNodeType): ArchNodeTypeConfig {
  return CONFIG_BY_TYPE[type] ?? ARCH_NODE_TYPES[0];
}

// Tailwind can't see dynamically-built class names, so every accent color
// used above needs its classes spelled out here to survive the production
// purge.
export const ARCH_ACCENT_CLASSES: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  sky: { bg: 'bg-sky-100 dark:bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-500/30', ring: 'ring-sky-400' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/30', ring: 'ring-indigo-400' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/30', ring: 'ring-violet-400' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-500/15', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/30', ring: 'ring-cyan-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30', ring: 'ring-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30', ring: 'ring-amber-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30', ring: 'ring-orange-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/30', ring: 'ring-rose-400' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-500/30', ring: 'ring-slate-400' },
  fuchsia: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/15', text: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'border-fuchsia-200 dark:border-fuchsia-500/30', ring: 'ring-fuchsia-400' },
};

export function emptyArchitecture() {
  return { nodes: [], edges: [] };
}
