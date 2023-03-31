import { useCallback, useEffect, useMemo } from 'react';
import { ModelFlow } from './graph.styles';
import ClassNode from './node';
import 'reactflow/dist/style.css';
import {
  useEdgesState,
  useNodesState,
  addEdge,
  NodeTypes,
  EdgeTypes,
  MarkerType,
} from 'reactflow';
import { convertToNodes, generateEdgesMock, generateNodesMock } from './utils';
import Edge from './edge';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

interface GraphProps {
  modelId: string;
  children: JSX.Element;
}

export default function Graph({ modelId, children }: GraphProps) {
  const nodeTypes: NodeTypes = useMemo(() => ({ classNode: ClassNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ associationEdge: Edge }), []);
  const { data, isSuccess } = useQueryInternalResourcesQuery({
    query: '',
    limitToDataModel: modelId,
    pageSize: 5000,
    pageFrom: 0,
    resourceTypes: [ResourceType.CLASS],
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const deleteEdgeById = useCallback(
    (id: string) => {
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'associationEdge',
            markerEnd: {
              type: MarkerType.Arrow,
            },
            label: 'Assosiaatio',
            data: {
              ...params.data,
              handleDelete: deleteEdgeById,
            },
          },
          eds
        )
      );
    },
    [setEdges, deleteEdgeById]
  );

  useEffect(() => {
    if (isSuccess) {
      const newNodes = convertToNodes(data);
      setNodes(newNodes);
    }
  }, [data, isSuccess, setNodes]);

  return (
    <ModelFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
    >
      {children}
    </ModelFlow>
  );
}
