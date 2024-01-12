import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlowWrapper, ModelFlow } from './graph.styles';
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
  selectGraphHasChanges,
  selectModelTools,
  selectResetPosition,
  selectSavePosition,
  selectSelected,
  selectUpdateVisualization,
  setGraphHasChanges,
  setHighlighted,
  setResetPosition,
  setSavePosition,
  setSelected,
  setUpdateVisualization,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import { ClassNode, CornerNode, ExternalNode, AttributeNode } from './nodes';
import { v4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import { ClearArrow } from './marker-ends';
import convertToNodes, { updateNodes } from './utils/convert-to-nodes';
import convertToEdges from './utils/convert-to-edges';
import generatePositionsPayload from './utils/generate-positions-payload';
import getUnusedCornerIds from './utils/get-unused-corner-ids';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import DefaultEdge from './edges/edge';
import getConnectedElements, {
  getClassConnectedElements,
} from './utils/get-connected-elements';
import handleCornerNodeDelete from './utils/handle-corner-node-delete';
import { ReferenceType } from '@app/common/interfaces/visualization.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';
import GraphNotification from './graph-notification';
import { selectLogin } from '@app/common/components/login/login.slice';
import {
  recalculateOffset,
  splitEdgeFn,
  toggleShowAttributes,
} from './utils/graph-utils';
import { checkPermission } from '@app/common/utils/has-permission';

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
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { project, getZoom } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const savePosition = useSelector(selectSavePosition());
  const resetPosition = useSelector(selectResetPosition());
  const updateVisualization = useSelector(selectUpdateVisualization());
  const tools = useSelector(selectModelTools());
  const user = useSelector(selectLogin());
  const graphHasChanges = useSelector(selectGraphHasChanges());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [cleanUnusedCorners, setCleanUnusedCorners] = useState(false);
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
  const { data, isFetching, isSuccess, refetch } = useGetVisualizationQuery({
    modelid: modelId,
    version: version,
  });
  const [putPositions, result] = usePutPositionsMutation();

  const refetchNodes = useCallback(() => {
    refetch();
    dispatch(setGraphHasChanges(false));
  }, [refetch, dispatch]);

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

      splitEdgeFn({
        applicationProfile,
        newCornerId,
        // project() is used here to position the corner node correctly according to where the user clicked
        position: project({ x: x - left - 20 * getZoom(), y: y - top }),
        referenceType,
        source,
        target,
        deleteNodeById,
        setEdges,
        setNodes,
      });
    },
    [setEdges, setNodes, project, deleteNodeById, getZoom, applicationProfile]
  );

  const onEdgeClick = useCallback(
    (e, edge) => {
      if (edge.data.identifier && globalSelected.id !== edge.data.identifier) {
        dispatch(
          setSelected(
            edge.data.identifier,
            edge.referenceType === 'PARENT_CLASS' ? 'classes' : 'associations',
            modelId
          )
        );
        return;
      }

      splitEdge(
        edge.source,
        edge.target,
        e.clientX,
        e.clientY,
        edge.referenceType
      );
      dispatch(setGraphHasChanges(true));
    },
    [dispatch, globalSelected.id, modelId, splitEdge]
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

  const setNodePositions = useCallback(() => {
    if (!data) {
      return;
    }

    const { edges, loopNodes } = convertToEdges(
      data.nodes,
      data.hiddenNodes,
      t,
      modelId,
      deleteNodeById,
      applicationProfile
    );

    setNodes([
      ...convertToNodes(
        data.nodes,
        data.hiddenNodes,
        modelId,
        deleteNodeById,
        applicationProfile,
        refetchNodes,
        organizationIds
      ),
      ...(loopNodes ? loopNodes : []),
    ]);
    setEdges(edges);

    if (resetPosition) {
      dispatch(setResetPosition(false));
      dispatch(setGraphHasChanges(false));
    }
  }, [
    applicationProfile,
    data,
    deleteNodeById,
    dispatch,
    modelId,
    organizationIds,
    refetchNodes,
    resetPosition,
    setEdges,
    setNodes,
    t,
  ]);

  const nodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (
        checkPermission({
          user: user,
          actions: ['EDIT_DATA_MODEL'],
          targetOrganizations: organizationIds,
        }) &&
        node.dragging
      ) {
        dispatch(setGraphHasChanges(true));
      }
    },
    [organizationIds, user, dispatch]
  );

  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (updateVisualization) {
        const { edges, loopNodes } = convertToEdges(
          data.nodes,
          data.hiddenNodes,
          t,
          modelId,
          deleteNodeById,
          applicationProfile
        );

        setNodes((nodes) => [
          ...updateNodes(
            nodes,
            data.nodes,
            data.hiddenNodes,
            modelId,
            deleteNodeById,
            applicationProfile,
            refetchNodes,
            organizationIds
          ),
          ...(loopNodes ? loopNodes : []),
        ]);
        setEdges(edges);
        dispatch(setUpdateVisualization(false));
      } else {
        setNodePositions();
      }
    }
  }, [
    isSuccess,
    setNodePositions,
    applicationProfile,
    data,
    deleteNodeById,
    dispatch,
    modelId,
    organizationIds,
    refetchNodes,
    resetPosition,
    setEdges,
    setNodes,
    t,
    isFetching,
    updateVisualization,
  ]);

  useEffect(() => {
    if (savePosition && !result.isLoading) {
      const positions = generatePositionsPayload(nodes, edges);

      putPositions({ modelId, version, data: positions });

      dispatch(setSavePosition(false));
    }
  }, [
    savePosition,
    edges,
    modelId,
    version,
    nodes,
    putPositions,
    result,
    dispatch,
  ]);

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(setNotification('POSITION_SAVE'));

      if (graphHasChanges) {
        dispatch(setGraphHasChanges(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, dispatch]);

  useEffect(() => {
    if (applicationProfile) {
      recalculateOffset({
        nodes,
        showAttributeRestrictions: tools.showAttributeRestrictions,
        setEdges,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationProfile, tools.showAttributeRestrictions, setEdges]);

  useEffect(() => {
    toggleShowAttributes({
      edges,
      showAttributes: tools.showAttributes,
      showAttributeRestrictions: tools.showAttributeRestrictions,
      setEdges,
      setNodes,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setNodes,
    setEdges,
    tools.showAttributeRestrictions,
    tools.showAttributes,
  ]);

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

  useEffect(() => {
    if (updateVisualization) {
      refetchNodes();
    }
  }, [updateVisualization, refetchNodes, dispatch]);

  useEffect(() => {
    if (resetPosition) {
      setNodePositions();
    }
  }, [resetPosition, setNodePositions]);

  return (
    <FlowWrapper ref={reactFlowWrapper} $isSmall={isSmall}>
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
        // Initial zoom level options
        // Min zoom could be set to smaller to fit the view
        // for larger data models
        fitViewOptions={{
          maxZoom: 1.2,
          minZoom: 1,
        }}
        maxZoom={5}
        minZoom={0.2}
      >
        <GraphNotification hasChanges={graphHasChanges} />
        {children}
      </ModelFlow>
    </FlowWrapper>
  );
};

// This is just a wrapper component to make useReactFlow() available
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
