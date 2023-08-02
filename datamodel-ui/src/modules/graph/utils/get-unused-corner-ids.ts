import { Edge, Node } from 'reactflow';

export function getUnusedCornerIds(nodes: Node[], edges: Edge[]): string[] {
  if (nodes.length < 1) {
    return [];
  }

  const corners = nodes.filter((node) => node.id.includes('#corner'));

  if (corners.length < 1) {
    return [];
  }

  const ids: string[] = [];

  corners.forEach((corner) => {
    if (
      edges.filter(
        (edge) => edge.source === corner.id || edge.target === corner.id
      ).length < 2
    ) {
      ids.push(corner.id);
    }
  });

  return ids;
}
