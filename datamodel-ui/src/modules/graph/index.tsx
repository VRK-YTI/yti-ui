import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelFlow } from './graph.styles';
import ClassNode from './node';
import 'reactflow/dist/style.css';
import {
  useEdgesState,
  useNodesState,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import {
  convertToNodes,
  createNewCornerEdge,
  createNewCornerNode,
  generateInitialEdges,
  generatePositionsPayload,
  getUnusedCornerIds,
  handleEdgeDelete,
} from './utils';
import LabeledEdge from './labeled-edge';
import {
  useGetVisualizationQuery,
  usePutPositionsMutation,
} from '@app/common/components/visualization/visualization.slice';
import { useStoreDispatch } from '@app/store';
import {
  selectDisplayLang,
  selectResetPosition,
  selectSavePosition,
  selectSelected,
  setResetPosition,
  setSavePosition,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import EdgeCorner from './edge-corner';
import SplittableEdge from './splittable-edge';
import { v4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import ExtNode from './ext-node';
import { ClearArrow } from './marker-ends';

interface GraphProps {
  modelId: string;
  children: JSX.Element[];
}

const GraphContent = ({ modelId, children }: GraphProps) => {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const displayLang = useSelector(selectDisplayLang());
  const savePosition = useSelector(selectSavePosition());
  const resetPosition = useSelector(selectResetPosition());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [cleanUnusedCorners, setCleanUnusedCorners] = useState(false);
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      classNode: ClassNode,
      cornerNode: EdgeCorner,
      externalNode: ExtNode,
    }),
    []
  );
  const edgeTypes: EdgeTypes = useMemo(
    () => ({ associationEdge: LabeledEdge, defaultEdge: SplittableEdge }),
    []
  );
  const { data, isSuccess } = useGetVisualizationQuery(modelId);
  const [putPositions, result] = usePutPositionsMutation();

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

  const onEdgeClick = useCallback(
    (e, edge) => {
      if (globalSelected.id !== edge.data.identifier) {
        dispatch(setSelected(edge.data.identifier, 'associations'));
      }
    },
    [dispatch, globalSelected.id]
  );

  useEffect(() => {
    if (isSuccess || (isSuccess && resetPosition)) {
      setNodes(convertToNodes(data.nodes, data.hiddenNodes, i18n.language));
      setEdges(
        generateInitialEdges(
          data.nodes,
          data.hiddenNodes,
          deleteEdgeById,
          splitEdge,
          i18n.language
        )
      );

      if (resetPosition) {
        dispatch(setResetPosition(false));
      }
    }
  }, [
    data,
    isSuccess,
    setNodes,
    setEdges,
    deleteEdgeById,
    splitEdge,
    i18n.language,
    displayLang,
    resetPosition,
    dispatch,
  ]);

  useEffect(() => {
    if (savePosition && !result.isLoading) {
      const positions = generatePositionsPayload(nodes, edges);

      putPositions({ modelId, data: positions });

      dispatch(setSavePosition(false));
    }
  }, [savePosition, edges, modelId, nodes, putPositions, result, dispatch]);

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

  return (
    <div ref={reactFlowWrapper} style={{ height: '100%', width: '100%' }}>
      <ModelFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        maxZoom={100}
      >
        {children}
      </ModelFlow>
    </div>
  );
};

export default function Graph({ modelId, children }: GraphProps) {
  return (
    <>
      <ReactFlowProvider>
        <GraphContent modelId={modelId}>{children}</GraphContent>
      </ReactFlowProvider>

      <ClearArrow />
    </>
  );
}
