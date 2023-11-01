import {
  VisualizationHiddenNode,
  VisualizationReferenceType,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { Edge } from 'reactflow';
import createEdge from '../create-edge';
import { TFunction, useTranslation } from 'next-i18next';

export default function convertToEdges(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  t: TFunction,
  applicationProfile?: boolean
): Edge[] {
  if (
    !nodes ||
    nodes.length < 1 ||
    nodes.filter(
      (node) =>
        (node.associations && node.associations.length > 0) ||
        node.references.length > 0
    ).length < 1
  ) {
    return [];
  }

  const referenceLabels: {
    targetId: string;
    offsetSource?: number;
    identifier: string;
    label?: { [key: string]: string } | string;
  }[] = [];

  const getEdgeParams = (
    source: string,
    reference: VisualizationReferenceType | VisualizationHiddenNode,
    isCorner?: boolean
  ) => {
    const target = `${isCorner ? '#' : ''}${reference.referenceTarget}`;
    return {
      source: source,
      sourceHandle: source,
      target: target,
      targetHandle: target,
      id: `reactflow__edge-${source}-${target}`,
      referenceType: reference.referenceType,
    };
  };

  const edges = nodes
    .filter(
      (node) =>
        (node.associations && node.associations.length > 0) ||
        node.references.length > 0
    )
    .flatMap((node) => [
      ...(node.associations
        ? node.associations
            .filter((assoc) => assoc.referenceTarget)
            .flatMap((assoc, idx) => {
              const offsetSource = node.attributes
                ? node.attributes.length + idx + 1
                : undefined;

              const label = applicationProfile ? t('targets') : undefined;

              if (assoc.referenceTarget?.startsWith('corner-')) {
                referenceLabels.push({
                  targetId: getEndEdge(assoc.referenceTarget),
                  identifier: assoc.identifier,
                  label: label,
                  offsetSource: offsetSource,
                });

                return createEdge({
                  params: getEdgeParams(node.identifier, assoc, true),
                  offsetSource: offsetSource,
                  applicationProfile: applicationProfile,
                  isCorner: true,
                });
              }

              return createEdge({
                label: label,
                identifier: assoc.identifier,
                params: getEdgeParams(node.identifier, assoc),
                applicationProfile: applicationProfile,
                offsetSource: offsetSource,
              });
            })
        : []),

      ...node.references.flatMap((reference) => {
        let label;
        if (applicationProfile && reference.referenceType === 'PARENT_CLASS') {
          label = t('utilizes');
        } else if (
          !applicationProfile &&
          reference.referenceType === 'ASSOCIATION'
        ) {
          label = reference.label;
        }

        if (reference.referenceTarget.startsWith('corner-')) {
          referenceLabels.push({
            targetId: getEndEdge(reference.referenceTarget),
            identifier: reference.identifier,
            label: label,
          });

          return createEdge({
            params: getEdgeParams(node.identifier, reference, true),
            isCorner: true,
          });
        }

        return createEdge({
          label: label,
          identifier: reference.identifier,
          params: getEdgeParams(node.identifier, reference),
          applicationProfile,
        });
      }),
    ]);

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return edges;
  }

  const splitEdges = hiddenNodes.map((node) => {
    const nodeIdentifier = `#${node.identifier}`;
    if (node.referenceTarget.startsWith('corner-')) {
      return createEdge({
        params: getEdgeParams(nodeIdentifier, node, true),
        isCorner: true,
      });
    }

    if (node.referenceTarget.includes(':')) {
      return createEdge({
        params: getEdgeParams(nodeIdentifier, node),
      });
    }

    const associationInfo = referenceLabels.find(
      (a) => a.targetId === node.referenceTarget
    );

    if (!associationInfo) {
      return null;
    }

    return createEdge({
      label: associationInfo.label,
      identifier: associationInfo.identifier,
      params: getEdgeParams(nodeIdentifier, node),
      offsetSource: associationInfo.offsetSource,
      applicationProfile: applicationProfile,
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
