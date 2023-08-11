import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { Node } from 'reactflow';

export default function createClassNode(
  node: VisualizationType,
  applicationProfile?: boolean
): Node {
  return {
    id: node.identifier,
    position: { x: node.position.x, y: node.position.y },
    data: {
      identifier: node.identifier,
      label: node.label,
      ...(applicationProfile !== undefined
        ? { applicationProfile: applicationProfile }
        : {}),
      resources: [
        ...node.attributes.map((a) => ({
          ...a,
          type: ResourceType.ATTRIBUTE,
        })),
        ...(applicationProfile
          ? node.associations.map((a) => ({
              identifier: a.identifier,
              label: a.label,
              type: ResourceType.ASSOCIATION,
            }))
          : []),
      ],
    },
    type: 'classNode',
  };
}
