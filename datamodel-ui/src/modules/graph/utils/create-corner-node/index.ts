import { VisualizationHiddenNode } from '@app/common/interfaces/visualization.interface';
import { Node, XYPosition } from 'reactflow';

export default function createCornerNode(
  node: VisualizationHiddenNode,
  applicationProfile?: boolean,
  handleNodeDelete?: (id: string) => void
): Node {
  return {
    id: node.identifier.startsWith('#corner')
      ? node.identifier
      : `#${node.identifier}`,
    data: {
      applicationProfile: applicationProfile,
      ...(handleNodeDelete ? { handleNodeDelete: handleNodeDelete } : {}),
    },
    position: node.position,
    type: 'cornerNode',
  };
}

export function createNewCornerNode(id: string, position: XYPosition): Node {
  const nodeId = id.startsWith('#') ? id : `#${id}`;

  return {
    id: nodeId,
    data: {},
    position: position,
    type: 'cornerNode',
  };
}
