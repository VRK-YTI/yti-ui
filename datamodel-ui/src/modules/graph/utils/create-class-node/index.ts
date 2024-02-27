import { ClassNodeDataType } from '@app/common/interfaces/graph.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { Node } from 'reactflow';

export default function createClassNode(
  node: VisualizationType,
  modelId: string,
  applicationProfile?: boolean,
  refetch?: () => void,
  organizationIds?: string[]
): Node<ClassNodeDataType> {
  return {
    id: node.identifier,
    position: { x: node.position.x, y: node.position.y },
    data: {
      identifier: node.identifier,
      modelId: modelId,
      label: node.label,
      ...(applicationProfile !== undefined
        ? { applicationProfile: applicationProfile }
        : {}),
      uri: node.uri,
      resources: [
        ...(node.attributes ?? []).map((a) => ({
          ...a,
          type: ResourceType.ATTRIBUTE as ResourceType.ATTRIBUTE,
        })),
        ...(node.associations ?? []).map((a) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { referenceTarget, ...rest } = a;
          return {
            ...rest,
            type: ResourceType.ASSOCIATION as ResourceType.ASSOCIATION,
          };
        }),
      ],
      ...(typeof organizationIds !== 'undefined'
        ? { organizationIds: organizationIds }
        : undefined),
      ...(refetch ? { refetch: refetch } : {}),
    },
    type: 'classNode',
  };
}
