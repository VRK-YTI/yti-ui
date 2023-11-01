import {
  NodeType,
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import createClassNode from '../create-class-node';
import createCornerNode from '../create-corner-node';
import { Node } from 'reactflow';
import createExternalNode from '../create-external-node';
import createAttributeNode from '../create-attribute-node';

const getNodeByType = (
  node: VisualizationType,
  modelId: string,
  applicationProfile?: boolean,
  refetch?: () => void,
  organizationIds?: string[],
) => {
  if (node.type === 'CLASS') {
    return createClassNode(node, modelId, applicationProfile, refetch, organizationIds);
  } else if (node.type === 'ATTRIBUTE') {
    return createAttributeNode(node, modelId, refetch);
  } else {
    return createExternalNode(node, applicationProfile);
  }
};

export default function convertToNodes(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  modelId: string,
  handleNodeDelete: (id: string) => void,
  applicationProfile?: boolean,
  refetch?: () => void,
  organizationIds?: string[]
): Node[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return nodes.map((node) =>
      getNodeByType(node, modelId, applicationProfile, refetch, organizationIds)
    );
  }

  return [
    ...nodes.map((node) =>
      getNodeByType(node, modelId, applicationProfile, refetch, organizationIds)
    ),
    ...hiddenNodes.map((node) =>
      createCornerNode(node, handleNodeDelete, applicationProfile)
    ),
  ];
}
