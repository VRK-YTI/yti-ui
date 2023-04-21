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
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import { convertToNodes } from './utils';
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

interface GraphProps {
  modelId: string;
  children: JSX.Element;
}

const GraphContent = ({ modelId, children }: GraphProps) => {
  const dispatch = useStoreDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const nodeTypes: NodeTypes = useMemo(
    () => ({ classNode: ClassNode, cornerEdge: EdgeCorner }),
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
  const [cleanUnused, setCleanUnused] = useState(false);

  const deleteEdgeById = useCallback(
    (id: string, source: string, target: string) => {
      setEdges((edges) =>
        edges
          .filter((edge) => edge.id !== id)
          .map((edge) => {
            if (edge.source === target) {
              return {
                ...edge,
                source: source,
              };
            }
            return edge;
          })
      );
      setCleanUnused(true);
    },
    [setEdges]
  );

  const splitEdge = useCallback(
    (source: string, target: string, x: number, y: number) => {
      const { top, left } = reactFlowWrapper.current
        ? reactFlowWrapper.current.getBoundingClientRect()
        : { top: 0, left: 0 };
      const randromId = v4().split('-')[0];
      const newCornerId = `corner-${randromId}`;
      const newCornerEdge = {
        id: newCornerId,
        data: {},
        position: project({ x: x - left - 26, y: y - top }),
        type: 'cornerEdge',
      };

      setNodes((nodes) => [...nodes, newCornerEdge]);

      const newEdges = [
        {
          id: `react-flow__edge-path-${source}-.corner-${newCornerId}`,
          source: source,
          target: newCornerId,
          type: 'defaultEdge',
          data: {
            handleDelete: deleteEdgeById,
            splitEdge: splitEdge,
          },
        },
      ];

      if (target.includes('corner')) {
        newEdges.push({
          id: `react-flow__edge-path-${newCornerId}-.corner-${target}`,
          source: newCornerId,
          target: target,
          type: 'defaultEdge',
          data: {
            handleDelete: deleteEdgeById,
            splitEdge: splitEdge,
          },
        });
      }

      setEdges((edges) => [
        ...edges
          .map((edge) => {
            if (!target.includes('corner') && !edge.target.includes('corner')) {
              return {
                ...edge,
                id: `reactflow__edge-${newCornerId}-${edge.target}`,
                source: newCornerId,
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
              splitEdge: splitEdge,
            },
          },
          edges
        )
      );
    },
    [setEdges, deleteEdgeById, splitEdge]
  );

  useEffect(() => {
    if (isSuccess) {
      setNodes(convertToNodes(data));
    }
  }, [data, isSuccess, setNodes]);

  useEffect(() => {
    const cleanCorners = () => {
      const corners = nodes.filter((node) => node.id.includes('corner'));
      const delIds: string[] = [];

      corners.forEach((corner) => {
        if (
          edges.filter(
            (edge) => edge.source === corner.id || edge.target === corner.id
          ).length < 1
        ) {
          delIds.push(corner.id);
        }
      });

      if (delIds.length > 0) {
        setNodes(nodes.filter((node) => !delIds.includes(node.id)));
      }
    };

    if (cleanUnused) {
      cleanCorners();
      setCleanUnused(false);
    }
  }, [cleanUnused, edges, nodes, setNodes]);

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
