import { Edge, Node } from 'reactflow';

export default function getConnectedElements(
  start: Edge | Node,
  nodes: Node[],
  edges: Edge[]
): string[] {
  if (!start || !nodes || !edges || edges.length < 1) {
    return [];
  }

  function getConnected(begin: Edge, direction: 'target' | 'source'): string[] {
    const node = nodes.find((n) => n.id === begin[direction]);

    if (
      direction === 'target'
        ? begin.source === begin[direction]
        : begin.target === begin[direction]
    ) {
      return [begin.id];
    }

    if (
      node &&
      node.type === 'classNode' &&
      (!edges.some(
        (e) =>
          e[direction === 'target' ? 'source' : 'target'] === begin[direction]
      ) ||
        nodes.find((n) => n.id === begin[direction])?.type === 'classNode')
    ) {
      return [begin.id, begin[direction]];
    }

    const newNode = edges.find(
      (e) =>
        e[direction === 'target' ? 'source' : 'target'] === begin[direction]
    );

    if (!newNode) {
      return [begin.id, begin[direction]];
    }

    return [begin.id, begin[direction], ...getConnected(newNode, direction)];
  }

  if (start.type === 'cornerNode') {
    const sourceEdge = edges.find((e) => e.source === start.id);
    const targetEdge = edges.find((e) => e.target === start.id);

    if (!sourceEdge || !targetEdge) {
      return [];
    }

    return [
      ...getConnected(sourceEdge, 'target'),
      ...getConnected(targetEdge, 'source'),
    ].filter((value, index, arr) => arr.indexOf(value) === index);
  }

  return [
    ...getConnected(start as Edge, 'target'),
    ...getConnected(start as Edge, 'source'),
  ].filter((value, index, arr) => arr.indexOf(value) === index);
}

export function getClassConnectedElements(
  start: Node,
  nodes: Node[],
  edges: Edge[]
): string[] {
  const relatedEdges = edges.filter(
    (e) => e.target === start.id || e.source === start.id
  );

  if (relatedEdges.length < 1) {
    return [];
  }

  return relatedEdges
    .flatMap((e) => getConnectedElements(e, nodes, edges))
    .filter((value, index, arr) => arr.indexOf(value) === index);
}
