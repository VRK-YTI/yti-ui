import { Edge } from 'reactflow';

export default function handleEdgeDelete(edgeId: string, edges: Edge[]) {
  const delEdge = edges.find((e) => e.id === edgeId);

  if (!delEdge) {
    return edges;
  }

  // Filter edge if it is directly connected between two class nodes
  if (
    !delEdge.target.includes('#corner') &&
    !delEdge.source.includes('#corner')
  ) {
    return edges.filter((e) => e.id !== edgeId);
  }

  // If edge isn't the last edge between two class nodes (= associationEdge),
  // bypass the corner node otherwise delete the entire edge between two classes
  if (delEdge.target.includes('#corner') && delEdge.type === 'defaultEdge') {
    return edges
      .filter((e) => e.id !== edgeId)
      .map((e) => {
        if (e.source === delEdge.target) {
          return {
            ...e,
            source: delEdge.source,
            sourceHandle: delEdge.source,
            id: `reactflow__edge-${delEdge.source}-${
              e.target.includes('#corner') ? `#corner-${e.target}` : e.target
            }`,
          };
        }

        return e;
      });
  } else if (delEdge.type === 'associationEdge') {
    const connectedIds = getConnectedCornerIds(edges, delEdge.source);
    return edges.filter((e) => !connectedIds.includes(e.id));
  }

  return edges;
}

export function getConnectedCornerIds(data: Edge[], source?: string): string[] {
  if (!source || data.length < 1) {
    return [];
  }

  return getRelatedEdgeIds(data, source);
}

function getRelatedEdgeIds(
  data: Edge[],
  source: string,
  ids?: string[]
): string[] {
  const s = data.find((edge) => edge.target === source);
  const retVal = s?.id ?? '';
  const newSource = s?.source;

  if (!s && ids) {
    return ids;
  }

  if (retVal && newSource && retVal.includes('#corner')) {
    return getRelatedEdgeIds(
      data,
      newSource,
      ids
        ? [...ids, retVal]
        : [data.find((edge) => edge.source === source)?.id ?? '', retVal]
    );
  }

  return ids
    ? [...ids, data.find((edge) => edge.source === source)?.id ?? '']
    : [data.find((edge) => edge.source === source)?.id ?? ''];
}
