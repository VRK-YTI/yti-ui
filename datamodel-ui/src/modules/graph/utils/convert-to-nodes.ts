import {
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { createClassNode } from './create-class-node';
import { createCornerNode } from './create-corner-node';
import { Node } from 'reactflow';

export function convertToNodes(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  applicationProfile?: boolean
): Node[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return nodes.map((node) => createClassNode(node, applicationProfile));
  }

  return [
    ...nodes.map((node) => createClassNode(node, applicationProfile)),
    ...hiddenNodes.map((node) => createCornerNode(node)),
  ];
}
