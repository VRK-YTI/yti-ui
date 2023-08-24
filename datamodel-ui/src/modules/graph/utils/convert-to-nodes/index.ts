import {
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import createClassNode from '../create-class-node';
import createCornerNode from '../create-corner-node';
import { Node } from 'reactflow';

export default function convertToNodes(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  modelId: string,
  applicationProfile?: boolean,
  refetch?: () => void
): Node[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return nodes.map((node) =>
      createClassNode(node, modelId, applicationProfile, refetch)
    );
  }

  return [
    ...nodes.map((node) =>
      createClassNode(node, modelId, applicationProfile, refetch)
    ),
    ...hiddenNodes.map((node) => createCornerNode(node)),
  ];
}
