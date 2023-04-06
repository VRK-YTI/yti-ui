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
import { convertToNodes } from './utils';
import Edge from './edge';
import { useGetVisualizationQuery } from '@app/common/components/visualization/visualization.slice';
import { useStoreDispatch } from '@app/store';
import {
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';

interface GraphProps {
  modelId: string;
  children: JSX.Element;
}

export default function Graph({ modelId, children }: GraphProps) {
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const nodeTypes: NodeTypes = useMemo(() => ({ classNode: ClassNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ associationEdge: Edge }), []);
  const { data, isSuccess } = useGetVisualizationQuery(modelId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const deleteEdgeById = useCallback(
    (id: string) => {
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (e, node) => {
      if (globalSelected.id !== node.id) {
        dispatch(setSelected(node.id, 'classes'));
      }
    },
    [dispatch, globalSelected.id]
  );

  const onEdgeClick = useCallback(
    (e, edge) => {
      if (globalSelected.id !== edge.id) {
        dispatch(setSelected(edge.id, 'associations'));
      }
    },
    [dispatch, globalSelected.id]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge(
          {
            ...params,
            type: 'associationEdge',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              height: 30,
              width: 30,
            },
            label: 'Assosiaatio',
            data: {
              ...params.data,
              handleDelete: deleteEdgeById,
            },
          },
          edges
        )
      );
    },
    [setEdges, deleteEdgeById]
  );

  useEffect(() => {
    if (isSuccess) {
      setNodes(convertToNodes(data));
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
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      fitView
    >
      {children}
    </ModelFlow>
  );
}
