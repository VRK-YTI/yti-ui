import { VisualizationHiddenNode } from '@app/common/interfaces/visualization.interface';
import { Node, XYPosition } from 'reactflow';

export default function createCornerNode(node: VisualizationHiddenNode): Node {
  return {
    id: `#${node.identifier}`,
    data: {},
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
