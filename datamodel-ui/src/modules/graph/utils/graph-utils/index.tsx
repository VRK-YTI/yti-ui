import { Edge, Node } from 'reactflow';
import createCornerNode from '../create-corner-node';
import { SetStateAction } from 'react';
import createEdge from '../create-edge';
import { ReferenceType } from '@app/common/interfaces/visualization.interface';
import { ClassNodeDataType } from '@app/common/interfaces/graph.interface';
import getBetweenNodes from '../get-between-nodes';

export function splitEdgeFn({
  applicationProfile,
  newCornerId,
  position,
  referenceType,
  source,
  target,
  deleteNodeById,
  setEdges,
  setNodes,
}: {
  applicationProfile?: boolean;
  newCornerId: string;
  position: {
    x: number;
    y: number;
  };
  referenceType: ReferenceType;
  source: string;
  target: string;
  deleteNodeById: (value: string) => void;
  setEdges: (edges: SetStateAction<Edge[]>) => void;
  setNodes: (nodes: SetStateAction<Node[]>) => void;
}) {
  setNodes((nodes) => [
    ...nodes,
    createCornerNode(
      {
        identifier: newCornerId,
        position: position,
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
        referenceType: referenceType,
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
          referenceType: referenceType,
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
      .filter((edge) => !(edge.source === source && edge.target === target)),
    ...newEdges,
  ]);
}

export function toggleShowAttributes({
  edges,
  showAttributes,
  showAttributeRestrictions,
  setEdges,
  setNodes,
}: {
  edges: Edge[];
  showAttributes: boolean;
  showAttributeRestrictions: boolean;
  setEdges: (edges: SetStateAction<Edge[]>) => void;
  setNodes: (nodes: SetStateAction<Node[]>) => void;
}) {
  let cornersToBeToggled: string[] = [];
  const hide = !showAttributeRestrictions || !showAttributes;

  setNodes((nodes) =>
    nodes.map((node) => {
      if (node.type === 'attributeNode') {
        const betweenIds = getBetweenNodes(node, nodes, edges);
        cornersToBeToggled = betweenIds.filter((id) =>
          id.startsWith('#corner')
        );

        setEdges((edges) =>
          edges.map((edge) => {
            if (betweenIds.includes(edge.id)) {
              return { ...edge, hidden: hide };
            }
            return edge;
          })
        );
        return { ...node, hidden: hide };
      }
      return node;
    })
  );

  setNodes((nodes) =>
    nodes.map((node) => {
      if (node.type === 'cornerNode' && cornersToBeToggled.includes(node.id)) {
        return { ...node, hidden: hide };
      }
      return node;
    })
  );
}

export function recalculateOffset({
  nodes,
  showAttributeRestrictions,
  setEdges,
}: {
  nodes: Node[];
  showAttributeRestrictions: boolean;
  setEdges: (edges: SetStateAction<Edge[]>) => void;
}) {
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
          offsetSource: showAttributeRestrictions
            ? edge.data.offsetSource + attributeCount
            : edge.data.offsetSource - attributeCount,
        },
      };
    })
  );
}
