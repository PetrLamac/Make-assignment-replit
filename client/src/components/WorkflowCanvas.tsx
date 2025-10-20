import { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import UploadNode from './nodes/UploadNode';
import AIAnalysisNode from './nodes/AIAnalysisNode';

const nodeTypes = {
  upload: UploadNode,
  aiAnalysis: AIAnalysisNode,
};

interface WorkflowCanvasProps {
  onImageUpload?: (file: File) => void;
  onAnalysisComplete?: (result: any) => void;
  analysisResult?: any;
  isAnalyzing?: boolean;
}

export default function WorkflowCanvas({
  onImageUpload,
  onAnalysisComplete,
  analysisResult,
  isAnalyzing = false,
}: WorkflowCanvasProps) {
  const initialNodes: Node[] = [
    {
      id: 'upload-1',
      type: 'upload',
      position: { x: 100, y: 200 },
      data: { label: 'Upload Image', onImageUpload },
    },
    {
      id: 'ai-1',
      type: 'aiAnalysis',
      position: { x: 450, y: 200 },
      data: { 
        label: 'AI Analysis',
        isAnalyzing,
        result: analysisResult,
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e-upload-ai',
      source: 'upload-1',
      target: 'ai-1',
      type: 'smoothstep',
      animated: isAnalyzing,
      style: { stroke: isAnalyzing ? '#8B5CF6' : '#CBD5E1', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isAnalyzing ? '#8B5CF6' : '#CBD5E1',
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full" data-testid="canvas-workflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'upload':
                return '#6366F1';
              case 'aiAnalysis':
                return '#8B5CF6';
              default:
                return '#94a3b8';
            }
          }}
          maskColor="rgb(240, 240, 240, 0.6)"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E5E7EB" />
      </ReactFlow>
    </div>
  );
}
