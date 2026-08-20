import type { Node, Edge } from '@xyflow/react';
import { Architecture, ArchitectureNode, ArchitectureNodeType } from '../types';
import type { DiagramNodeData } from '../components/Architecture/DiagramNode';

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const VALID_NODE_TYPES: ArchitectureNodeType[] = [
  'client', 'frontend', 'backend', 'api', 'database', 'cache', 'queue', 'auth', 'storage', 'external',
];

interface RawArchNode {
  id: string;
  type: string;
  label: string;
  description?: string;
}

interface RawArchEdge {
  source: string;
  target: string;
  label?: string;
}

/**
 * Turns an AI-proposed { nodes, edges } (ids only, no coordinates) into a
 * fully positioned Architecture using a simple layered (topological) layout:
 * nodes with no incoming edges start at layer 0, and every other node sits
 * one layer past its furthest predecessor. Cycles/orphans are pushed to a
 * trailing layer rather than left unplaced.
 */
export function layoutArchitecture(rawNodes: RawArchNode[], rawEdges: RawArchEdge[]): Architecture {
  const seenIds = new Set<string>();
  const nodes: ArchitectureNode[] = [];

  for (const n of rawNodes ?? []) {
    if (!n?.id || seenIds.has(n.id)) continue;
    seenIds.add(n.id);
    nodes.push({
      id: n.id,
      type: VALID_NODE_TYPES.includes(n.type as ArchitectureNodeType) ? (n.type as ArchitectureNodeType) : 'backend',
      label: n.label || n.id,
      description: n.description,
      position: { x: 0, y: 0 },
    });
  }

  const edges = (rawEdges ?? [])
    .filter((e) => e?.source && e?.target && seenIds.has(e.source) && seenIds.has(e.target))
    .map((e) => ({ id: makeId('edge'), source: e.source, target: e.target, label: e.label }));

  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  nodes.forEach((n) => inDegree.set(n.id, 0));
  edges.forEach((e) => {
    adjacency.set(e.source, [...(adjacency.get(e.source) ?? []), e.target]);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  });

  const layer = new Map<string, number>();
  const queue: string[] = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id);
  queue.forEach((id) => layer.set(id, 0));
  const remainingIndegree = new Map(inDegree);

  let head = 0;
  while (head < queue.length) {
    const id = queue[head++];
    const currentLayer = layer.get(id) ?? 0;
    for (const target of adjacency.get(id) ?? []) {
      layer.set(target, Math.max(layer.get(target) ?? 0, currentLayer + 1));
      remainingIndegree.set(target, (remainingIndegree.get(target) ?? 0) - 1);
      if ((remainingIndegree.get(target) ?? 0) <= 0 && !queue.includes(target)) {
        queue.push(target);
      }
    }
  }

  const maxAssignedLayer = Math.max(-1, ...Array.from(layer.values()));
  nodes.forEach((n) => {
    if (!layer.has(n.id)) layer.set(n.id, maxAssignedLayer + 1); // cycle/orphan fallback
  });

  const nodesByLayer = new Map<number, ArchitectureNode[]>();
  nodes.forEach((n) => {
    const l = layer.get(n.id) ?? 0;
    nodesByLayer.set(l, [...(nodesByLayer.get(l) ?? []), n]);
  });

  const LAYER_GAP_X = 260;
  const NODE_GAP_Y = 130;
  nodesByLayer.forEach((layerNodes, l) => {
    const offset = ((layerNodes.length - 1) * NODE_GAP_Y) / 2;
    layerNodes.forEach((n, i) => {
      n.position = { x: l * LAYER_GAP_X, y: i * NODE_GAP_Y - offset };
    });
  });

  return { nodes, edges };
}

export function architectureToFlow(arch: Architecture | undefined): { nodes: Node<DiagramNodeData>[]; edges: Edge[] } {
  const safe = arch ?? { nodes: [], edges: [] };
  return {
    nodes: safe.nodes.map((n) => ({
      id: n.id,
      type: 'archNode',
      position: n.position,
      data: { label: n.label, nodeType: n.type, description: n.description },
    })),
    edges: safe.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep',
      animated: false,
    })),
  };
}

export function flowToArchitecture(nodes: Node<DiagramNodeData>[], edges: Edge[]): Architecture {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: (n.data.nodeType ?? 'backend') as ArchitectureNodeType,
      label: n.data.label ?? 'Untitled',
      description: n.data.description,
      position: n.position,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : undefined,
    })),
  };
}
