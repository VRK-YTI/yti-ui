import { VisualizationPutType } from '@app/common/interfaces/visualization.interface';
import { Edge, Node } from 'reactflow';

export default function generatePositionsPayload(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: Node<any>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edges: Edge<any>[]
): VisualizationPutType[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  return nodes.map((node) => {
    const referenceTargets = edges
      .filter((edge) => edge.source === node.id)
      .map((edge) => {
        if (
          edge.target.startsWith('#corner') ||
          (edge.source.startsWith('#corner') &&
            !edge.target.startsWith('#corner'))
        ) {
          return cleanCornerIdentifier(edge.target);
        }
      })
      .filter((value) => typeof value === 'string' && value !== '') as string[];

    return {
      identifier: cleanCornerIdentifier(node.id),
      x: node.position.x,
      y: node.position.y,
      referenceTargets: referenceTargets,
    };
  });
}

function cleanCornerIdentifier(identifier: string): string {
  if (identifier.startsWith('#corner')) {
    return identifier.replace('#corner', 'corner');
  }

  return identifier.toString();
}
