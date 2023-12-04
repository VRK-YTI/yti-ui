import { Edge, Node } from 'reactflow';

// Attribute node is expected to have only one outbound edge
export default function toggleAttrNodeVisibility(
  node: Node,
  nodes: Node[],
  edges: Edge[]
) {
  return getBetweenNodes(node.id, edges, nodes, [node.id]);
}

function getBetweenNodes(
  nodeId: string,
  edges: Edge[],
  nodes: Node[],
  ids: string[]
): string[] {
  const sourceEdge = edges.find((edge) => edge.source === nodeId);
  const targetNode = nodes.find((node) => node.id === sourceEdge?.target);

  if (!targetNode || !sourceEdge) {
    return ids;
  }

  if (targetNode?.type === 'cornerNode') {
    return getBetweenNodes(targetNode.id, edges, nodes, [
      ...ids,
      targetNode.id,
      sourceEdge.id,
    ]);
  } else {
    return [...ids, sourceEdge.id];
  }
}
