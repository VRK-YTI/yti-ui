import { VisualizationHiddenNode } from '@app/common/interfaces/visualization.interface';
import { Node, XYPosition } from 'reactflow';

export function createCornerNode(node: VisualizationHiddenNode): Node {
  return {
    id: `#${node.identifier}`,
    data: {},
    position: node.position,
    type: 'cornerNode',
  };
}

export function createNewCornerNode(id: string, position: XYPosition): Node {
  return {
    id: id,
    data: {},
    position: position,
    type: 'cornerNode',
  };
}
