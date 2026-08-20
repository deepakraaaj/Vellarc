import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { ArchitectureNodeType } from '../../types';
import { ARCH_ACCENT_CLASSES, getArchNodeConfig } from './archTypes';

export interface DiagramNodeData {
  label: string;
  nodeType: ArchitectureNodeType;
  description?: string;
  readOnly?: boolean;
  onDelete?: (id: string) => void;
  [key: string]: unknown;
}

const handleStyle = 'w-2.5 h-2.5 !bg-indigo-500 dark:!bg-indigo-400 !border-2 !border-white dark:!border-slate-900';

export const DiagramNode: React.FC<NodeProps> = memo(({ id, data, selected }) => {
  const nodeData = data as DiagramNodeData;
  const config = getArchNodeConfig(nodeData.nodeType);
  const accent = ARCH_ACCENT_CLASSES[config.accent] ?? ARCH_ACCENT_CLASSES.indigo;
  const Icon = config.icon;

  return (
    <div
      className={`group relative min-w-[168px] max-w-[220px] rounded-2xl border-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md px-4 py-3 transition-all duration-150 ${
        selected ? `${accent.border} ring-2 ${accent.ring} shadow-lg` : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="target" position={Position.Top} className={handleStyle} />

      {!nodeData.readOnly && nodeData.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onDelete?.(id);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-600"
          title="Remove node"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}

      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${accent.bg} ${accent.text}`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">{nodeData.label}</p>
          <p className={`text-[10px] font-bold uppercase tracking-wide ${accent.text}`}>{config.label}</p>
        </div>
      </div>

      {nodeData.description && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{nodeData.description}</p>
      )}

      <Handle type="source" position={Position.Right} className={handleStyle} />
      <Handle type="source" position={Position.Bottom} className={handleStyle} />
    </div>
  );
});

DiagramNode.displayName = 'DiagramNode';
