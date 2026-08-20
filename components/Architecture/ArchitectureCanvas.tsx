import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Sparkles, Loader2, Trash2, Boxes, X } from 'lucide-react';
import { Architecture, ArchitectureNodeType } from '../../types';
import { architectureToFlow, flowToArchitecture, makeId } from '../../lib/architecture';
import { useIsDarkMode } from '../../lib/useIsDarkMode';
import { ARCH_ACCENT_CLASSES, ARCH_NODE_TYPES, getArchNodeConfig } from './archTypes';
import { DiagramNode, type DiagramNodeData } from './DiagramNode';

const nodeTypes = { archNode: DiagramNode };

interface ArchitectureCanvasProps {
  value: Architecture;
  onChange: (arch: Architecture) => void;
  onSuggest?: () => Promise<Architecture | null>;
}

const CanvasInner: React.FC<ArchitectureCanvasProps> = ({ value, onChange, onSuggest }) => {
  const initial = useMemo(() => architectureToFlow(value), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [nodes, setNodes] = useState<Node<DiagramNodeData>[]>(initial.nodes);
  const [edges, setEdges] = useState<Edge[]>(initial.edges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const isDarkMode = useIsDarkMode();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const syncUp = useCallback(
    (nds: Node<DiagramNodeData>[], eds: Edge[]) => {
      onChange(flowToArchitecture(nds, eds));
    },
    [onChange]
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const next = nds.filter((n) => n.id !== id);
        setEdges((eds) => {
          const nextEdges = eds.filter((e) => e.source !== id && e.target !== id);
          syncUp(next, nextEdges);
          return nextEdges;
        });
        return next;
      });
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [syncUp]
  );

  // Inject the delete handler into node data lazily so DiagramNode stays decoupled.
  const decoratedNodes = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, onDelete: deleteNode } })),
    [nodes, deleteNode]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const next = applyNodeChanges(changes, nds) as Node<DiagramNodeData>[];
        const settled = changes.every((c) => !(c.type === 'position' && c.dragging));
        if (settled) syncUp(next, edges);
        return next;
      });
    },
    [edges, syncUp]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const next = applyEdgeChanges(changes, eds);
        syncUp(nodes, next);
        return next;
      });
    },
    [nodes, syncUp]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const next = addEdge({ ...connection, id: makeId('edge'), type: 'smoothstep' }, eds);
        syncUp(nodes, next);
        return next;
      });
    },
    [nodes, syncUp]
  );

  const addNode = useCallback(
    (type: ArchitectureNodeType) => {
      const config = getArchNodeConfig(type);
      const bounds = wrapperRef.current?.getBoundingClientRect();
      const center = bounds
        ? screenToFlowPosition({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 })
        : { x: 0, y: 0 };
      const jitter = () => (Math.random() - 0.5) * 140;
      const newNode: Node<DiagramNodeData> = {
        id: makeId('node'),
        type: 'archNode',
        position: { x: center.x + jitter(), y: center.y + jitter() },
        data: { label: config.defaultLabel, nodeType: type },
      };
      setNodes((nds) => {
        const next = [...nds, newNode];
        syncUp(next, edges);
        return next;
      });
      setIsPaletteOpen(false);
      setSelectedId(newNode.id);
    },
    [edges, syncUp, screenToFlowPosition]
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<DiagramNodeData>) => {
      if (!selectedId) return;
      setNodes((nds) => {
        const next = nds.map((n) => (n.id === selectedId ? { ...n, data: { ...n.data, ...patch } } : n));
        syncUp(next, edges);
        return next;
      });
    },
    [selectedId, edges, syncUp]
  );

  const handleSuggest = async () => {
    if (!onSuggest || isSuggesting) return;
    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const result = await onSuggest();
      if (result) {
        const flow = architectureToFlow(result);
        setNodes(flow.nodes);
        setEdges(flow.edges);
        syncUp(flow.nodes, flow.edges);
      }
    } catch (err) {
      console.error('Architecture suggestion failed:', err);
      setSuggestError('Could not generate a suggestion. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="h-full min-h-[420px]">
      {/* Canvas */}
      <div ref={wrapperRef} className="relative w-full h-full rounded-2xl overflow-hidden border border-white/60 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40">
        <ReactFlow
          nodes={decoratedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => setSelectedId(n.id)}
          onPaneClick={() => setSelectedId(null)}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          colorMode={isDarkMode ? 'dark' : 'light'}
        >
          <Background gap={20} size={1} className="opacity-60" />
          <Controls showInteractive={false} className="!shadow-lg !rounded-xl overflow-hidden" />
          <MiniMap
            pannable
            zoomable
            className="!rounded-xl !shadow-lg"
            maskColor={isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(240, 240, 240, 0.6)'}
            bgColor={isDarkMode ? '#0f172a' : '#ffffff'}
            nodeColor={isDarkMode ? '#475569' : '#e2e2e2'}
          />
        </ReactFlow>

        {/* Toolbar */}
        <div className="absolute top-3 left-3 z-10 flex items-start gap-2">
          <div className="relative">
            <button
              onClick={() => setIsPaletteOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl shadow-md font-bold text-sm text-gray-700 dark:text-gray-200 hover:shadow-lg transition-all"
            >
              <Plus size={16} />
              Add Component
            </button>
            {isPaletteOpen && (
              <div className="absolute top-full mt-2 left-0 w-56 max-h-72 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl shadow-xl p-2 z-20">
                {ARCH_NODE_TYPES.map((cfg) => {
                  const accent = ARCH_ACCENT_CLASSES[cfg.accent];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={cfg.type}
                      onClick={() => addNode(cfg.type)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${accent.bg} ${accent.text}`}>
                        <Icon size={14} />
                      </span>
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {onSuggest && (
            <button
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-md font-bold text-sm disabled:opacity-60 transition-all"
            >
              {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isSuggesting ? 'Thinking...' : 'Suggest with AI'}
            </button>
          )}
        </div>

        {suggestError && (
          <div className="absolute bottom-3 left-3 right-3 z-10 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-3 py-2">
            {suggestError}
          </div>
        )}

        {nodes.length === 0 && !isSuggesting && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-6">
              <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 flex items-center justify-center">
                <Boxes size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No components yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a component or ask AI to suggest an architecture.</p>
            </div>
          </div>
        )}

        {/* Inspector popup: appears over the canvas only while a node is selected,
            so the diagram keeps the full width the rest of the time. */}
        {selectedNode && (
          <div className="absolute top-3 right-3 z-10 w-80 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border border-white/60 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Component</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  title="Delete component"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition-colors"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Type</label>
                <select
                  value={selectedNode.data.nodeType}
                  onChange={(e) => updateSelectedNode({ nodeType: e.target.value as ArchitectureNodeType })}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-900 dark:text-white"
                >
                  {ARCH_NODE_TYPES.map((cfg) => (
                    <option key={cfg.type} value={cfg.type}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={selectedNode.data.description ?? ''}
                  onChange={(e) => updateSelectedNode({ description: e.target.value })}
                  rows={4}
                  placeholder="What does this component do?"
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white resize-none"
                />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                Drag from a component's edge to another to connect them. Click the canvas to close.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = (props) => (
  <ReactFlowProvider>
    <CanvasInner {...props} />
  </ReactFlowProvider>
);
