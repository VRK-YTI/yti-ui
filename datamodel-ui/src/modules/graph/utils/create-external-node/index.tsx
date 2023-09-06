import { VisualizationType } from '@app/common/interfaces/visualization.interface';

export default function createExternalNode(
  node: VisualizationType,
  applicationProfile?: boolean
) {
  return {
    id: node.identifier,
    position: { x: node.position.x, y: node.position.y },
    data: {
      identifier: node.identifier,
      label: node.label,
      ...(applicationProfile ? { applicationProfile: true } : {}),
    },
    type: 'externalNode',
  };
}
