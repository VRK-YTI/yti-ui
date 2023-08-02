import {
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { Edge } from 'reactflow';
import { createAssociationEdge } from './create-association-edge';
import { createCornerEdge } from './create-corner-edge';

export function convertToEdges(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  applicationProfile?: boolean
): Edge[] {
  if (
    !nodes ||
    nodes.length < 1 ||
    nodes.filter((node) => node.associations.length > 0).length < 1
  ) {
    return [];
  }

  const edges = nodes
    .filter(
      (node) => node.associations.length > 0 || node.parentClasses.length > 0
    )
    .flatMap((node) => [
      ...node.associations
        .filter((assoc) => assoc.referenceTarget)
        .flatMap((assoc) => {
          if (assoc.referenceTarget?.startsWith('corner')) {
            return createCornerEdge(
              node.identifier,
              `#${assoc.referenceTarget}`,
              {
                handleDelete,
                splitEdge,
              }
            );
          }

          return createAssociationEdge(
            assoc.label,
            handleDelete,
            splitEdge,
            assoc.identifier,
            {
              source: node.identifier,
              sourceHandle: node.identifier,
              target: assoc.referenceTarget,
              targetHandle: assoc.referenceTarget,
              id: `reactflow__edge-${node.identifier}-${assoc.referenceTarget}`,
            },
            applicationProfile
          );
        }),
      ...node.parentClasses
        .filter((parent) => nodes.find((n) => n.identifier === parent))
        .flatMap((parent) => {
          const parentNode = nodes.find(
            (n) => n.identifier === parent
          ) as VisualizationType;

          return createAssociationEdge(
            parentNode?.label,
            handleDelete,
            splitEdge,
            parent,
            {
              source: parent,
              sourceHandle: parent,
              target: node.identifier,
              targetHandle: node.identifier,
              id: `reactflow__edge-${parent}-${node.identifier}`,
            },
            applicationProfile
          );
        }),
    ]);

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return edges;
  }

  const splitEdges = hiddenNodes.map((node) => {
    const nodeIdentifier = `#${node.identifier}`;

    if (node.referenceTarget.startsWith('corner')) {
      return createCornerEdge(nodeIdentifier, `#${node.referenceTarget}`, {
        handleDelete,
        splitEdge,
      });
    }

    const targetClass = nodes.find(
      (n) => n.identifier === node.referenceTarget
    );

    if (!targetClass) {
      return null;
    }

    return createAssociationEdge(
      targetClass.label,
      handleDelete,
      splitEdge,
      node.referenceTarget,
      {
        source: nodeIdentifier,
        sourceHandle: nodeIdentifier,
        target: node.referenceTarget,
        targetHandle: node.referenceTarget,
        id: `reactflow__edge-${nodeIdentifier}-${node.referenceTarget}`,
      }
    );
  });

  return [...edges, ...(splitEdges.filter((edge) => edge !== null) as Edge[])];
}
