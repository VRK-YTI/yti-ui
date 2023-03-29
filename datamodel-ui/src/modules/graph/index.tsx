import { useCallback, useEffect, useMemo } from 'react';
import { ModelFlow } from './graph.styles';
import ClassNode from './node';
import 'reactflow/dist/style.css';
import { useEdgesState, useNodesState, addEdge } from 'reactflow';
import { generateEdgesMock, generateNodesMock } from './utils';

interface GraphProps {
  children: JSX.Element;
}

export default function Graph({ children }: GraphProps) {
  const nodeTypes = useMemo(() => ({ classNode: ClassNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodesMock(25));
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdgesMock(25));

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params }, eds)),
    [setEdges]
  );

  return (
    <ModelFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      {children}
    </ModelFlow>
  );
}
