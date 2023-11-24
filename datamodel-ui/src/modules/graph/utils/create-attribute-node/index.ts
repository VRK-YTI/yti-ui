import { AttributeNodeType } from '@app/common/interfaces/graph.interface';
import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { Node } from 'reactflow';

export default function createAttributeNode(
  node: VisualizationType,
  modelId: string,
  refetch?: () => void
): Node<AttributeNodeType> {
  return {
    id: node.identifier,
    position: { x: node.position.x, y: node.position.y },
    data: {
      identifier: node.identifier,
      modelId: modelId,
      label: node.label,
      uri: node.uri,
      dataType: node.dataType,
      ...(refetch ? { refetch: refetch } : {}),
    },
    type: 'attributeNode',
  };
}
