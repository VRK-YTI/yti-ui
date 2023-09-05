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

  const associationLabels: {
    targetId: string;
    offsetSource?: number;
    identifier: string;
    label: { [key: string]: string };
  }[] = [];

  const edges = nodes
    .filter(
      (node) => node.associations.length > 0 || node.parentClasses.length > 0
    )
    .flatMap((node) => [
      ...node.associations
        .filter((assoc) => assoc.referenceTarget)
        .flatMap((assoc, idx) => {
          if (assoc.referenceTarget?.startsWith('corner')) {
            associationLabels.push({
              targetId: getEndEdge(assoc.referenceTarget),
              identifier: assoc.identifier,
              label: assoc.label,
              offsetSource: applicationProfile
                ? node.attributes.length + idx + 1
                : undefined,
            });

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

    const associationInfo = associationLabels.find(
      (a) => a.targetId === node.referenceTarget
    );

    if (!associationInfo) {
      return null;
    }

    return createEdge({
      label: associationInfo.label,
      identifier: associationInfo.identifier,
      params: {
        source: nodeIdentifier,
        sourceHandle: nodeIdentifier,
        target: node.referenceTarget,
        targetHandle: node.referenceTarget,
        id: `reactflow__edge-${nodeIdentifier}-${node.referenceTarget}`,
      },
      offsetSource: associationInfo.offsetSource,
    });
  });

  return [...edges, ...(splitEdges.filter((edge) => edge !== null) as Edge[])];

  function getEndEdge(id: string): string {
    const targetNode = hiddenNodes.find((n) => n.identifier === id);

    if (!targetNode) {
      return '';
    }

    if (targetNode.referenceTarget.startsWith('corner-')) {
      return getEndEdge(targetNode.referenceTarget);
    }

    return targetNode.referenceTarget;
  }
}
