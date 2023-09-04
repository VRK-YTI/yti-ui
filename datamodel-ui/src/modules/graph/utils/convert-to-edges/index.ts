import {
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { Edge } from 'reactflow';
import createEdge from '../create-edge';

export default function convertToEdges(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
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
        .flatMap((assoc, idx) => {
          if (assoc.referenceTarget?.startsWith('corner')) {
            return createEdge({
              params: {
                source: node.identifier,
                sourceHandle: node.identifier,
                target: `#${assoc.referenceTarget}`,
                targetHandle: `#${assoc.referenceTarget}`,
                id: `reactflow__edge-${node.identifier}-#${assoc.referenceTarget}`,
              },
              isCorner: true,
            });
          }

          return createEdge({
            label: assoc.label,
            identifier: assoc.identifier,
            params: {
              source: node.identifier,
              sourceHandle: node.identifier,
              target: assoc.referenceTarget,
              targetHandle: assoc.referenceTarget,
              id: `reactflow__edge-${node.identifier}-${assoc.referenceTarget}`,
            },
            applicationProfile: applicationProfile,
            offsetSource: applicationProfile
              ? node.attributes.length + idx + 1
              : undefined,
          });
        }),

      ...node.parentClasses
        .filter((parent) => nodes.find((n) => n.identifier === parent))
        .flatMap((parent) => {
          const parentNode = nodes.find(
            (n) => n.identifier === parent
          ) as VisualizationType;

          return createEdge({
            label: parentNode?.label,
            identifier: parent,
            params: {
              source: parent,
              sourceHandle: parent,
              target: node.identifier,
              targetHandle: node.identifier,
              id: `reactflow__edge-${parent}-${node.identifier}`,
            },
            applicationProfile,
          });
        }),
    ]);

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return edges;
  }

  const splitEdges = hiddenNodes.map((node) => {
    const nodeIdentifier = `#${node.identifier}`;

    if (node.referenceTarget.startsWith('corner')) {
      return createEdge({
        params: {
          source: nodeIdentifier,
          sourceHandle: nodeIdentifier,
          target: `#${node.referenceTarget}`,
          targetHandle: `#${node.referenceTarget}`,
          id: `reactflow__edge-${nodeIdentifier}-#${node.referenceTarget}`,
        },
        isCorner: true,
      });
    }

    const targetClass = nodes.find(
      (n) => n.identifier === node.referenceTarget
    );

    if (!targetClass) {
      return null;
    }

    return createEdge({
      label: targetClass.label,
      identifier: node.referenceTarget,
      params: {
        source: nodeIdentifier,
        sourceHandle: nodeIdentifier,
        target: node.referenceTarget,
        targetHandle: node.referenceTarget,
        id: `reactflow__edge-${nodeIdentifier}-${node.referenceTarget}`,
      },
    });
  });

  return [...edges, ...(splitEdges.filter((edge) => edge !== null) as Edge[])];
}
