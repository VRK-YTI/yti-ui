import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Edge, MarkerType, Node, XYPosition } from 'reactflow';

export function convertToNodes(
  data: VisualizationType[],
  lang?: string
): Node[] {
  if (data.length < 1) {
    return [];
  }

  const size = data.length;
  const spread = Math.floor(Math.sqrt(size));

  console.log('data', data);

  return data.map((obj, idx) => ({
    id: obj.identifier,
    position: { x: 400 * (idx % spread), y: 200 * Math.floor(idx / spread) },
    data: {
      identifier: obj.identifier,
      label: getLanguageVersion({
        data: obj.label,
        lang: lang ? lang : 'fi',
        appendLocale: true,
      }),
      resources: obj.attributes
        ? obj.attributes.map((attr) => ({
            identifier: attr.identifier,
            label: getLanguageVersion({
              data: attr.label,
              lang: lang ? lang : 'fi',
              appendLocale: true,
            }),
          }))
        : [],
    },
    type: 'classNode',
  }));
}

export function createNewAssociationEdge(
  label: string,
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  params: any
) {
  return {
    ...params,
    type: 'associationEdge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 30,
      width: 30,
    },
    label: label,
    data: {
      ...params.data,
      handleDelete: handleDelete,
      splitEdge: splitEdge,
    },
  };
}

export function createNewCornerNode(id: string, position: XYPosition) {
  return {
    id: id,
    data: {},
    position: position,
    type: 'cornerNode',
  };
}

export function createNewCornerEdge(
  source: string,
  target: string,
  data: object
) {
  return {
    id: `reactflow__edge-${source}-#corner-${target}`,
    source: source,
    sourceHandle: source,
    target: target,
    targetHandle: target,
    type: 'defaultEdge',
    data: data,
  };
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

export function handleEdgeDelete(edgeId: string, edges: Edge[]) {
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
