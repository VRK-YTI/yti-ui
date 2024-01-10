import {
  Position,
  VisualizationHiddenNode,
  VisualizationReferenceType,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { Edge, Node } from 'reactflow';
import createEdge from '../create-edge';
import { TFunction } from 'next-i18next';
import createCornerNode from '../create-corner-node';
import { v4 } from 'uuid';

export default function convertToEdges(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  t: TFunction,
  modelId: string,
  deleteNodeById: (value: string) => void,
  applicationProfile?: boolean
): {
  edges: Edge[];
  loopNodes?: Node[];
} {
  if (
    !nodes ||
    nodes.length < 1 ||
    nodes.filter(
      (node) =>
        (node.associations && node.associations.length > 0) ||
        node.references.length > 0
    ).length < 1
  ) {
    return {
      edges: [],
    };
  }

  const referenceLabels: {
    targetId: string;
    offsetSource?: number;
    identifier: string;
    label?: { [key: string]: string } | string;
  }[] = [];

  const loopEdges: Edge[] = [];
  const loopNodes: Node[] = [];

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

  const createLoopNode = (
    position: Position,
    identifier: string,
    target: string
  ) => {
    return createCornerNode(
      {
        identifier,
        position,
        referenceTarget: target,
        referenceType: 'ASSOCIATION',
      },
      deleteNodeById,
      applicationProfile
    );
  };

  const createLoopEdge = (
    identifier: string,
    source: string,
    target: string,
    offsetSource?: number
  ) => {
    return createEdge({
      modelId,
      identifier,
      params: {
        source: source,
        sourceHandle: source,
        target: target,
        targetHandle: target,
        id: `reactflow__edge-${source}-${target}`,
        referenceType: 'ASSOCIATION',
      },
      applicationProfile,
      isCorner: true,
      offsetSource,
    });
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

              if (assoc.referenceTarget === node.identifier) {
                const firstCornerNodeId = `#corner-${v4().split('-')[0]}`;
                const secondCornerNodeId = `#corner-${v4().split('-')[0]}`;

                const offsetY = (offsetSource ?? 1) * 25;
                const offsetX = idx * 30;

                loopNodes.push(
                  createLoopNode(
                    {
                      x: node.position.x - 150 - offsetX,
                      y: node.position.y + 40,
                    },
                    firstCornerNodeId,
                    secondCornerNodeId
                  ),
                  createLoopNode(
                    {
                      x: node.position.x - 150 - offsetX,
                      y: node.position.y + 80 + offsetY,
                    },
                    secondCornerNodeId,
                    node.identifier
                  )
                );

                loopEdges.push(
                  createLoopEdge(
                    assoc.identifier,
                    secondCornerNodeId,
                    firstCornerNodeId
                  ),
                  createLoopEdge(
                    assoc.identifier,
                    node.identifier,
                    secondCornerNodeId
                  )
                );

                return createEdge({
                  label: label,
                  identifier: assoc.identifier,
                  params: getEdgeParams(firstCornerNodeId, assoc),
                  applicationProfile,
                });
              }

              return createEdge({
                identifier: assoc.identifier,
                params: getEdgeParams(node.identifier, assoc),
                applicationProfile: applicationProfile,
                offsetSource: offsetSource,
              });
            })
        : []),

      ...node.references.flatMap((reference, idx) => {
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
            identifier: ['ATTRIBUTE_DOMAIN', 'PARENT_CLASS'].includes(
              reference.referenceType
            )
              ? node.identifier
              : reference.identifier,
            label: label,
          });

          return createEdge({
            params: getEdgeParams(node.identifier, reference, true),
            isCorner: true,
          });
        }

        // If referenceTarget is the class node that association is part of,
        // create a corner node so that association is visible for user
        if (reference.referenceTarget === node.identifier) {
          const firstCornerNodeId = `#corner-${v4().split('-')[0]}`;
          const secondCornerNodeId = `#corner-${v4().split('-')[0]}`;
          const thirdCornerNodeId = `#corner-${v4().split('-')[0]}`;

          const offset = idx * 30;

          loopNodes.push(
            createLoopNode(
              {
                x: node.position.x - 150 - offset,
                y: node.position.y + 20 + offset,
              },
              firstCornerNodeId,
              secondCornerNodeId
            ),
            createLoopNode(
              {
                x: node.position.x - 150 - offset,
                y: node.position.y - 60 - offset,
              },
              secondCornerNodeId,
              thirdCornerNodeId
            ),
            createLoopNode(
              {
                x: node.position.x + 50 + offset,
                y: node.position.y - 60 - offset,
              },
              thirdCornerNodeId,
              node.identifier
            )
          );

          loopEdges.push(
            createLoopEdge(
              reference.identifier,
              secondCornerNodeId,
              firstCornerNodeId
            ),
            createLoopEdge(
              reference.identifier,
              thirdCornerNodeId,
              secondCornerNodeId
            ),
            createLoopEdge(
              reference.identifier,
              node.identifier,
              thirdCornerNodeId
            )
          );

          return createEdge({
            modelId: modelId,
            label: label,
            identifier: reference.identifier,
            params: getEdgeParams(firstCornerNodeId, reference),
            applicationProfile,
          });
        }

        return createEdge({
          modelId: modelId,
          label: label,
          identifier: ['ATTRIBUTE_DOMAIN', 'PARENT_CLASS'].includes(
            reference.referenceType
          )
            ? node.identifier
            : reference.identifier,
          params: getEdgeParams(node.identifier, reference),
          applicationProfile,
        });
      }),
    ]);

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return {
      edges: [...edges, ...loopEdges],
      loopNodes: loopNodes,
    };
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

    // remove element from referenceLabels because there might be several references
    // with the same target id. E.g. two associations with the same source (domain) and target (range)
    let associationInfo;
    let index;
    for (let i = 0; i < referenceLabels.length; i++) {
      const r = referenceLabels[i];
      if (r.targetId === node.referenceTarget) {
        associationInfo = r;
        index = i;
        break;
      }
    }

    if (!associationInfo) {
      return null;
    }

    if (index) {
      referenceLabels.splice(index, 1);
    }

    return createEdge({
      label: associationInfo.label,
      identifier: associationInfo.identifier,
      params: getEdgeParams(nodeIdentifier, node),
      offsetSource: associationInfo.offsetSource,
      applicationProfile: applicationProfile,
    });
  });

  return {
    edges: [
      ...edges,
      ...loopEdges,
      ...(splitEdges.filter((edge) => edge !== null) as Edge[]),
    ],
    loopNodes: loopNodes,
  };

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
