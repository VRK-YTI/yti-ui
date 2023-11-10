import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelFlow } from './graph.styles';
import 'reactflow/dist/style.css';
import {
  useEdgesState,
  useNodesState,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
  Node,
} from 'reactflow';
import {
  useGetVisualizationQuery,
  usePutPositionsMutation,
} from '@app/common/components/visualization/visualization.slice';
import { useStoreDispatch } from '@app/store';
import {
  resetHighlighted,
  selectDisplayLang,
  selectModelTools,
  selectResetPosition,
  selectSavePosition,
  selectSelected,
  setHighlighted,
  setResetPosition,
  setSavePosition,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import { ClassNode, CornerNode, ExternalNode, AttributeNode } from './nodes';
import { v4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import { ClearArrow } from './marker-ends';
import convertToNodes from './utils/convert-to-nodes';
import createCornerNode from './utils/create-corner-node';
import convertToEdges from './utils/convert-to-edges';
import generatePositionsPayload from './utils/generate-positions-payload';
import getUnusedCornerIds from './utils/get-unused-corner-ids';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import DefaultEdge from './edges/edge';
import createEdge from './utils/create-edge';
import getConnectedElements, {
  getClassConnectedElements,
} from './utils/get-connected-elements';
import handleCornerNodeDelete from './utils/handle-corner-node-delete';
import { ClassNodeDataType } from '@app/common/interfaces/graph.interface';
import { ReferenceType } from '@app/common/interfaces/visualization.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';
import GraphNotification from './graph-notification';
import { selectLogin } from '@app/common/components/login/login.slice';

interface GraphProps {
  modelId: string;
  version?: string;
  applicationProfile?: boolean;
  organizationIds?: string[];
  drawer?: JSX.Element;
  children: JSX.Element | JSX.Element[];
}

const GraphContent = ({
  modelId,
  version,
  applicationProfile,
  organizationIds,
  children,
}: GraphProps) => {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project, getZoom } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const displayLang = useSelector(selectDisplayLang());
  const savePosition = useSelector(selectSavePosition());
  const resetPosition = useSelector(selectResetPosition());
  const tools = useSelector(selectModelTools());
  const user = useSelector(selectLogin());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [cleanUnusedCorners, setCleanUnusedCorners] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      classNode: ClassNode,
      cornerNode: CornerNode,
      externalNode: ExternalNode,
      attributeNode: AttributeNode,
    }),
    []
  );
  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      generalEdge: DefaultEdge,
    }),
    []
  );
  const { data, isSuccess, refetch } = useGetVisualizationQuery({
    modelid: modelId,
    version: version,
  });
  const [putPositions, result] = usePutPositionsMutation();

  const deleteNodeById = useCallback(
    (id: string) => {
      handleCornerNodeDelete(id, setNodes, setEdges, applicationProfile);
    },
    [setNodes, setEdges, applicationProfile]
  );

  const splitEdge = useCallback(
    (
      source: string,
      target: string,
      x: number,
      y: number,
      referenceType: ReferenceType
    ) => {
      const { top, left } = reactFlowWrapper.current
        ? reactFlowWrapper.current.getBoundingClientRect()
        : { top: 0, left: 0 };
      const uuid = v4().split('-')[0];
      const newCornerId = `#corner-${uuid}`;

      setNodes((nodes) => [
        ...nodes,
        createCornerNode(
          {
            identifier: newCornerId,
            position: project({ x: x - left - 20 * getZoom(), y: y - top }),
            referenceTarget: target,
            referenceType: referenceType,
          },
          deleteNodeById,
          applicationProfile
        ),
      ]);

      const newEdges = [
        createEdge({
          params: {
            source: source,
            sourceHandle: source,
            target: newCornerId,
            targetHandle: newCornerId,
            id: `reactflow__edge-${source}-${newCornerId}`,
          },
          isCorner: true,
          applicationProfile,
        }),
      ];

      if (target.includes('corner')) {
        newEdges.push(
          createEdge({
            params: {
              source: newCornerId,
              sourceHandle: newCornerId,
              target: target,
              targetHandle: target,
              id: `reactflow__edge-${newCornerId}-${newCornerId}`,
            },
            isCorner: true,
            applicationProfile,
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
    [setEdges, setNodes, project, deleteNodeById, getZoom, applicationProfile]
  );

  const onEdgeClick = useCallback(
    (e, edge) => {
      if (edge.data.identifier && globalSelected.id !== edge.data.identifier) {
        dispatch(setSelected(edge.data.identifier, 'associations'));
        return;
      }

      splitEdge(
        edge.source,
        edge.target,
        e.clientX,
        e.clientY,
        edge.referenceType
      );
      setHasChanges(true);
    },
    [dispatch, globalSelected.id, splitEdge]
  );

  const onNodeMouseEnter = useCallback(
    (e, node) => {
      if (node.type !== 'cornerNode' && !tools.showClassHighlights) {
        return;
      }

      if (tools.showClassHighlights && node.type === 'classNode') {
        dispatch(setHighlighted(getClassConnectedElements(node, nodes, edges)));
        return;
      }

      dispatch(setHighlighted(getConnectedElements(node, nodes, edges)));
    },
    [dispatch, edges, nodes, tools.showClassHighlights]
  );

  const onNodeMouseLeave = useCallback(() => {
    if (globalSelected.id && globalSelected.type === 'associations') {
      const selectedEdge = edges.find(
        (e) => e.data.identifier === globalSelected.id
      );

      selectedEdge &&
        dispatch(
          setHighlighted(getConnectedElements(selectedEdge, nodes, edges))
        );

      return;
    }

    dispatch(resetHighlighted());
  }, [dispatch, globalSelected, edges, nodes]);

  const onEdgeMouseEnter = useCallback(
    (e, edge) => {
      dispatch(setHighlighted(getConnectedElements(edge, nodes, edges)));
    },
    [dispatch, edges, nodes]
  );

  const onEdgeMouseLeave = useCallback(() => {
    if (globalSelected.id && globalSelected.type === 'associations') {
      const selectedEdge = edges.find(
        (e) => e.data.identifier === globalSelected.id
      );
      selectedEdge &&
        dispatch(
          setHighlighted(getConnectedElements(selectedEdge, nodes, edges))
        );
      return;
    }

    dispatch(resetHighlighted());
  }, [dispatch, globalSelected, edges, nodes]);

  const nodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!user.anonymous && node.dragging) {
        setHasChanges(true);
      }
    },
    [user]
  );

  useEffect(() => {
    if (isSuccess || (isSuccess && resetPosition)) {
      setNodes(
        convertToNodes(
          data.nodes,
          data.hiddenNodes,
          modelId,
          deleteNodeById,
          applicationProfile,
          applicationProfile ? refetch : undefined,
          organizationIds
        )
      );
      setEdges(
        convertToEdges(data.nodes, data.hiddenNodes, t, applicationProfile)
      );

      if (resetPosition) {
        dispatch(setResetPosition(false));
        setHasChanges(false);
      }
    }
  }, [
    data,
    isSuccess,
    setNodes,
    setEdges,
    i18n.language,
    displayLang,
    resetPosition,
    dispatch,
    applicationProfile,
    modelId,
    refetch,
    deleteNodeById,
    organizationIds,
    t,
  ]);

  useEffect(() => {
    if (savePosition && !result.isLoading) {
      const positions = generatePositionsPayload(nodes, edges);

      putPositions({ modelId, data: positions });

      dispatch(setSavePosition(false));
    }
  }, [savePosition, edges, modelId, nodes, putPositions, result, dispatch]);

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(setNotification('POSITION_SAVE'));

      if (hasChanges) {
        setHasChanges(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, dispatch]);

  useEffect(() => {
    if (applicationProfile) {
      setEdges((edges) =>
        edges.map((edge) => {
          const sourceNode: Node<ClassNodeDataType> | undefined = nodes.find(
            (n) => n.id === edge.source
          );

          if (
            !sourceNode ||
            sourceNode.id.startsWith('#corner') ||
            sourceNode.data.resources.length === 0 ||
            sourceNode.data.resources.filter((r) => r.type !== 'ATTRIBUTE')
              .length === 0
          ) {
            return edge;
          }

          const attributeCount = sourceNode.data.resources.filter(
            (r) => r.type === 'ATTRIBUTE'
          ).length;

          return {
            ...edge,
            data: {
              ...edge.data,
              offsetSource: tools.showAttributeRestrictions
                ? edge.data.offsetSource + attributeCount
                : edge.data.offsetSource - attributeCount,
            },
          };
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationProfile, tools.showAttributeRestrictions, setEdges]);

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
    <div
      ref={reactFlowWrapper}
      style={{
        height: '100%',
        width: '100%',
        position: isSmall ? 'fixed' : 'relative',
      }}
    >
      <ModelFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeClick={onEdgeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onNodeDragStop={nodeDragStop}
        fitView
        fitViewOptions={{
          maxZoom: 1.2,
          minZoom: 1,
        }}
        maxZoom={5}
        minZoom={0.2}
      >
        <GraphNotification hasChanges={hasChanges} />
        {children}
      </ModelFlow>
    </div>
  );
};

export default function Graph({
  modelId,
  version,
  applicationProfile,
  organizationIds,
  drawer,
  children,
}: GraphProps) {
  return (
    <>
      <ReactFlowProvider>
        {drawer}

        <GraphContent
          modelId={modelId}
          version={version}
          applicationProfile={applicationProfile}
          organizationIds={organizationIds}
        >
          {children}
        </GraphContent>
      </ReactFlowProvider>

      <ClearArrow />
    </>
  );
}
