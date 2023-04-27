import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelFlow } from './graph.styles';
import ClassNode from './node';
import 'reactflow/dist/style.css';
import {
  useEdgesState,
  useNodesState,
  addEdge,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import {
  convertToNodes,
  createNewAssociationEdge,
  createNewCornerEdge,
  createNewCornerNode,
  getUnusedCornerIds,
  handleEdgeDelete,
} from './utils';
import LabeledEdge from './labeled-edge';
import { useGetVisualizationQuery } from '@app/common/components/visualization/visualization.slice';
import { useStoreDispatch } from '@app/store';
import {
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import EdgeCorner from './edge-corner';
import SplittableEdge from './splittable-edge';
import { v4 } from 'uuid';
import { useTranslation } from 'next-i18next';

interface GraphProps {
  modelId: string;
  children: JSX.Element;
}

const GraphContent = ({ modelId, children }: GraphProps) => {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const nodeTypes: NodeTypes = useMemo(
    () => ({ classNode: ClassNode, cornerNode: EdgeCorner }),
    []
  );
  const edgeTypes: EdgeTypes = useMemo(
    () => ({ associationEdge: LabeledEdge, defaultEdge: SplittableEdge }),
    []
  );
  const { data, isSuccess } = useGetVisualizationQuery(modelId);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [startNodeId, setStartNodeId] = useState<string | undefined>();
  const [cleanUnusedCorners, setCleanUnusedCorners] = useState(false);

  const deleteEdgeById = useCallback(
    (id: string) => {
      setEdges((edges) => handleEdgeDelete(id, edges));

      setCleanUnusedCorners(true);
    },
    [setEdges]
  );

  const splitEdge = useCallback(
    (source: string, target: string, x: number, y: number) => {
      const { top, left } = reactFlowWrapper.current
        ? reactFlowWrapper.current.getBoundingClientRect()
        : { top: 0, left: 0 };
      const uuid = v4().split('-')[0];
      const newCornerId = `#corner-${uuid}`;

      setNodes((nodes) => [
        ...nodes,
        createNewCornerNode(
          newCornerId,
          project({ x: x - left - 26, y: y - top })
        ),
      ]);

      const newEdges = [
        createNewCornerEdge(source, newCornerId, {
          handleDelete: deleteEdgeById,
          splitEdge: splitEdge,
        }),
      ];

      if (target.includes('corner')) {
        newEdges.push(
          createNewCornerEdge(newCornerId, target, {
            handleDelete: deleteEdgeById,
            splitEdge: splitEdge,
          })
        );
      }

      setEdges((edges) => [
        ...edges
          .map((edge) => {
            if (
              edge.target === target &&
              edge.source === source &&
              !target.includes('corner') &&
              !edge.target.includes('corner')
            ) {
              return {
                ...edge,
                id: `reactflow__edge-${newCornerId}-${edge.target}`,
                source: newCornerId,
                sourceHandle: newCornerId,
              };
            }

            return edge;
          })
          .filter(
            (edge) => !(edge.source === source && edge.target === target)
          ),
        ...newEdges,
      ]);
    },
    [setEdges, setNodes, project, deleteEdgeById]
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

  // const onConnectEnd = useCallback(
  //   (e) => {
  //     if (!startNodeId) {
  //       return;
  //     }

  //     if (e.target.className === 'react-flow__pane') {
  //       if (!reactFlowWrapper.current) {
  //         return;
  //       }

  //       const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

  //       // We need to subtract 26 from x position to get correct location
  //       // 26 is calculated by so:
  //       // ( Drawer width + half of the cornerEdge width ) / 2
  //       // = (42 + 5) / 2

  //       setNodes((nodes) => [
  //         ...nodes,
  //         {
  //           id: `corner-${edgePart}`,
  //           position: project({ x: e.clientX - left - 26, y: e.clientY - top }),
  //           data: {},
  //           type: 'cornerEdge',
  //         }
  //       ]);

  //       setEdges((edges) => [
  //         ...edges,
  //         { id: `${startNodeId}-corner-${edgePart}`, source: startNodeId, target: `corner-${edgePart}`, type: 'straight' }
  //       ]);

  //       setEdgePart((part) => part + 1);
  //     } else {
  //       setEdgePart(0);
  //     }

  //     setStartNodeId(undefined);
  //   },
  //   [startNodeId, edgePart, setEdges, setNodes, project]
  // );

  const onConnectStart = useCallback((e, params) => {
    setStartNodeId(params.nodeId);
  }, []);

  const onConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge(
          createNewAssociationEdge(
            'Assosiaatio',
            deleteEdgeById,
            splitEdge,
            params
          ),
          edges
        )
      );
    },
    [setEdges, deleteEdgeById, splitEdge]
  );

  useEffect(() => {
    if (isSuccess) {
      setNodes(convertToNodes(data, i18n.language));
    }
  }, [data, isSuccess, setNodes, i18n.language]);

  useEffect(() => {
    const cleanCorners = () => {
      const ids = getUnusedCornerIds(nodes, edges);

      if (ids.length > 0) {
        setNodes(nodes.filter((node) => !ids.includes(node.id)));
      }
    };

    if (cleanUnusedCorners) {
      cleanCorners();
      setCleanUnusedCorners(false);
    }
  }, [cleanUnusedCorners, edges, nodes, setNodes]);

  console.log('nodes', nodes);
  console.log('edges', edges);

  return (
    <div ref={reactFlowWrapper} style={{ height: '100%', width: '100%' }}>
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
        // onConnectEnd={onConnectEnd}
        // onConnectStart={onConnectStart}
        fitView
      >
        {children}
      </ModelFlow>
    </div>
  );
};

export default function Graph({ modelId, children }: GraphProps) {
  return (
    <ReactFlowProvider>
      <GraphContent modelId={modelId}>{children}</GraphContent>
    </ReactFlowProvider>
  );
}
