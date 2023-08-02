import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelFlow } from './graph.styles';
import ClassNode from './nodes/class-node';
import 'reactflow/dist/style.css';
import {
  useEdgesState,
  useNodesState,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import SolidEdge from './edges/labeled-edge';
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
import CornerNode from './nodes/corner-node';
import SplittableEdge from './edges/splittable-edge';
import { v4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import ExternalNode from './nodes/external-node';
import { ClearArrow } from './marker-ends';
import DottedEdge from './edges/dotted-edge';
import { convertToNodes } from './utils/convert-to-nodes';
import { createNewCornerNode } from './utils/create-corner-node';
import { convertToEdges } from './utils/convert-to-edges';
import { createCornerEdge } from './utils/create-corner-edge';
import { generatePositionsPayload } from './utils/generate-positions-payload';
import { getUnusedCornerIds } from './utils/get-unused-corner-ids';
import { handleEdgeDelete } from './utils/handle-edge-delete';

interface GraphProps {
  modelId: string;
  applicationProfile?: boolean;
  children: JSX.Element[];
}

const GraphContent = ({
  modelId,
  applicationProfile,
  children,
}: GraphProps) => {
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
      cornerNode: CornerNode,
      externalNode: ExternalNode,
    }),
    []
  );
  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      defaultEdge: SplittableEdge,
      dottedEdge: DottedEdge,
      solidEdge: SolidEdge,
    }),
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
        createCornerEdge(source, newCornerId, {
          handleDelete: deleteEdgeById,
          splitEdge: splitEdge,
        }),
      ];

      if (target.includes('corner')) {
        newEdges.push(
          createCornerEdge(newCornerId, target, {
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
      setNodes(
        convertToNodes(data.nodes, data.hiddenNodes, applicationProfile)
      );
      setEdges(
        convertToEdges(
          data.nodes,
          data.hiddenNodes,
          deleteEdgeById,
          splitEdge,
          applicationProfile
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
    applicationProfile,
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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeClick={onEdgeClick}
        fitView
        maxZoom={100}
      >
        {children}
      </ModelFlow>
    </div>
  );
};

export default function Graph({
  modelId,
  applicationProfile,
  children,
}: GraphProps) {
  return (
    <>
      <ReactFlowProvider>
        <GraphContent modelId={modelId} applicationProfile={applicationProfile}>
          {children}
        </GraphContent>
      </ReactFlowProvider>

      <ClearArrow />
    </>
  );
}
