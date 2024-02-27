import { Edge, Node } from 'reactflow';

export default function getStartNode(
  startElement: Node | Edge,
  nodes: Node[],
  edges: Edge[]
): Node | undefined {
  let start: Node | undefined;

  if ('source' in startElement) {
    start = nodes.find((node) => node.id === startElement.source);
  } else {
    start = startElement;
  }

  if (!start) {
    return undefined;
  }

  return getSource(start, edges, nodes);
}

function getSource(
  start: Node,
  edges: Edge[],
  nodes: Node[]
): Node | undefined {
  if (!start) {
    return;
  }

  if (start.type !== 'cornerNode') {
    return start;
  }

  const parent = nodes.find(
    (node) => node.id === edges.find((edge) => edge.target === start.id)?.source
  );

  if (!parent) {
    return;
  }

  return getSource(parent, edges, nodes);
}
