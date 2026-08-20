import React, { useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Architecture } from '../../types';
import { architectureToFlow } from '../../lib/architecture';
import { DiagramNode } from './DiagramNode';

const nodeTypes = { archNode: DiagramNode };

interface ArchitectureDiagramProps {
  value: Architecture;
  height?: number;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ value, height = 560 }) => {
  const { nodes, edges } = useMemo(() => {
    const flow = architectureToFlow(value);
    return {
      nodes: flow.nodes.map((n) => ({ ...n, data: { ...n.data, readOnly: true } })),
      edges: flow.edges,
    };
  }, [value]);

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={1.2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnScroll={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} className="opacity-60" />
          <Controls showInteractive={false} className="!shadow-lg !rounded-xl overflow-hidden" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
