import { CornerNodeDataType } from '@app/common/interfaces/graph.interface';
import { VisualizationHiddenNode } from '@app/common/interfaces/visualization.interface';
import { Node } from 'reactflow';

export default function createCornerNode(
  node: VisualizationHiddenNode,
  handleNodeDelete: (id: string) => void,
  applicationProfile?: boolean
): Node<CornerNodeDataType> {
  return {
    id: node.identifier.startsWith('#corner')
      ? node.identifier
      : `#${node.identifier}`,
    data: {
      handleNodeDelete: handleNodeDelete,
      ...(applicationProfile ? { applicationProfile: true } : {}),
    },
    position: node.position,
    type: 'cornerNode',
  };
}
