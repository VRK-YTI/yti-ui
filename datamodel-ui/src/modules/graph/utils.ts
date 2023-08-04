import {
  VisualizationHiddenNode,
  VisualizationPutType,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Edge, MarkerType, Node, XYPosition } from 'reactflow';

export function convertToNodes(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  lang?: string
): Node[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  const size = nodes.length;
  const spread = Math.floor(Math.sqrt(size));

  const retNodes = nodes.map((node, idx) => ({
    id: node.identifier,
    position:
      node.position.x !== 0 && node.position.y
        ? { x: node.position.x, y: node.position.y }
        : { x: 400 * (idx % spread), y: 200 * Math.floor(idx / spread) },
    data: {
      identifier: node.identifier,
      label: getLanguageVersion({
        data: node.label,
        lang: lang ? lang : 'fi',
        appendLocale: true,
      }),
      resources: node.attributes
        ? node.attributes.map((attr) => ({
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

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return retNodes;
  }

  const retHiddenNodes = hiddenNodes.map((node) => ({
    id: `#${node.identifier}`,
    data: {},
    position: {
      x: node.position.x,
      y: node.position.y,
    },
    type: 'cornerNode',
  }));

  return [...retNodes, ...retHiddenNodes];
}

export function generateInitialEdges(
  nodes: VisualizationType[],
  hiddenNodes: VisualizationHiddenNode[],
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  lang?: string
): Edge[] {
  if (
    !nodes ||
    nodes.length < 1 ||
    nodes.filter((node) => node.associations.length > 0).length < 1
  ) {
    return [];
  }

  const edges = nodes
    .filter(
      (node) => node.associations.length > 0 || node.parentClasses.length > 0
    )
    .flatMap((node) => [
      ...node.associations.flatMap((assoc) => {
        if (assoc.referenceTarget?.startsWith('corner')) {
          return createNewCornerEdge(
            node.identifier,
            `#${assoc.referenceTarget}`,
            {
              handleDelete,
              splitEdge,
            }
          );
        }

        return createNewAssociationEdge(
          getLanguageVersion({
            data: assoc.label,
            lang: lang ?? 'fi',
            appendLocale: true,
          }),
          handleDelete,
          splitEdge,
          assoc.identifier,
          {
            source: node.identifier,
            sourceHandle: node.identifier,
            target: assoc.referenceTarget,
            targetHandle: assoc.referenceTarget,
            id: `reactflow__edge-${node.identifier}-${assoc.referenceTarget}`,
          }
        );
      }),
      ...node.parentClasses.flatMap((parent) => {
        const parentNode = nodes.find((n) => n.identifier === parent);

        return createNewAssociationEdge(
          getLanguageVersion({
            data: parentNode?.label,
            lang: lang ?? 'fi',
            appendLocale: true,
          }),
          handleDelete,
          splitEdge,
          parent,
          {
            source: parent,
            sourceHandle: parent,
            target: node.identifier,
            targetHandle: node.identifier,
            id: `reactflow__edge-${parent}-${node.identifier}`,
          }
        );
      }),
    ]);

  if (!hiddenNodes || hiddenNodes.length < 1) {
    return edges;
  }

  const splitEdges = hiddenNodes.map((node) => {
    const nodeIdentifier = `#${node.identifier}`;

    if (node.referenceTarget.startsWith('corner')) {
      return createNewCornerEdge(nodeIdentifier, node.referenceTarget, {
        handleDelete,
        splitEdge,
      });
    }

    const targetClass = nodes.find(
      (n) => n.identifier === node.referenceTarget
    );

    return createNewAssociationEdge(
      getLanguageVersion({
        data: targetClass?.label,
        lang: lang ?? 'fi',
        appendLocale: true,
      }),
      handleDelete,
      splitEdge,
      node.referenceTarget,
      {
        source: nodeIdentifier,
        sourceHandle: nodeIdentifier,
        target: node.referenceTarget,
        targetHandle: node.referenceTarget,
        id: `reactflow__edge-${nodeIdentifier}-${node.referenceTarget}`,
      }
    );
  });

  return [...edges, ...splitEdges];
}

export function createNewAssociationEdge(
  label: string,
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  identifier: string,
  // This needs to be typed as "any" to correlate with specs of React Flow edge parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
) {
  return {
    ...params,
    type: 'associationEdge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    label: label,
    data: {
      ...params.data,
      handleDelete: handleDelete,
      splitEdge: splitEdge,
      identifier: identifier,
    },
    // markerEnd: 'clearArrow',
    // style: {
    //   strokeDasharray: '0 4 0',
    // }
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

function getValueInsideRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPoints(
  source: Node,
  target: Node
): {
  source: XYPosition;
  target: XYPosition;
} {
  if (source.type === 'cornerNode' && target.type === 'cornerNode') {
    return {
      source: {
        x: source.position.x + 20,
        y: source.position.y,
      },
      target: {
        x: target.position.x + 20,
        y: target.position.y,
      },
    };
  }

  let sourceX = 0;
  let sourceY = 0;
  let targetX = 0;
  let targetY = 0;

  const sx = source.position.x + 5;
  const sy = source.position.y + 5;
  const sw =
    source.type === 'cornerNode'
      ? source.width ?? 0
      : source.width
      ? source.width - 10
      : 0;
  const sh =
    source.type === 'cornerNode'
      ? source.height ?? 0
      : source.height
      ? source.height - 10
      : 0;

  const tx = target.position.x + 5;
  const ty = target.position.y + 5;
  const tw =
    target.type === 'cornerNode'
      ? target.width ?? 0
      : target.width
      ? target.width - 10
      : 0;
  const th =
    target.type === 'cornerNode'
      ? target.height ?? 0
      : target.height
      ? target.height - 10
      : 0;

  if (sx > tx + tw) {
    sourceX = sx;
    targetX = tx + tw;
  } else if (sx + sw < tx) {
    sourceX = sx + sw;
    targetX = tx;
  } else {
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const x = sourceIsCorner ? sx + 15 : tx + 15;
      sourceX = sourceIsCorner ? x : getValueInsideRange(x, sx, sx + sw);
      targetX = sourceIsCorner ? getValueInsideRange(x, tx, tx + tw) : x;
    } else {
      if (sx >= tx) {
        const x = sx + (tx + (tw - 5) - sx) / 2;
        sourceX = x;
        targetX = x;
      } else {
        const x = tx + (sx + (sw - 5) - tx) / 2;
        sourceX = x;
        targetX = x;
      }
    }
  }

  if (sy > ty + th) {
    sourceY = sy;
    targetY = ty + th;
  } else if (sy + sh < ty) {
    sourceY = sy + sh;
    targetY = ty;
  } else {
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const y = sourceIsCorner ? sy - 5 : ty - 5;
      sourceY = sourceIsCorner ? y : getValueInsideRange(y, sy, sy + sh);
      targetY = sourceIsCorner ? getValueInsideRange(y, ty, ty + th) : y;
    } else {
      if (sh === th) {
        sourceY = sy + sh / 2;
        targetY = ty + th / 2;
      } else {
        const sourceSmaller = sh < th;
        const smy = sourceSmaller ? sy : ty;
        const smh = sourceSmaller ? sh : th;
        const ly = sourceSmaller ? ty : sy;
        const lh = sourceSmaller ? th : sh;

        const sMid = smy + smh / 2;
        const sourceInside = smy > ly && smy + smh < ly + lh + 1;
        const sourceUpper = smy < ly + lh / 2;

        if (sourceUpper) {
          const yNew = smy + smh - (smy + smh - ly) / 2;

          switch (sourceSmaller) {
            case true:
              sourceY = yNew < sMid ? sMid : yNew;
              break;
            default:
              targetY = yNew < sMid ? sMid : yNew;
          }
        } else {
          const yNew = ly + lh - (ly + lh - smy) / 2;

          switch (sourceSmaller) {
            case true:
              sourceY = yNew > sMid ? sMid : yNew;
              break;
            default:
              targetY = yNew < sMid ? sMid : yNew;
          }
        }

        switch (sourceSmaller) {
          case true:
            targetY = sourceUpper ? ly : ly + lh;
            targetY = sourceInside ? sourceY : targetY;
            break;
          default:
            sourceY = sourceUpper ? ly : ly + lh;
            sourceY = sourceInside ? targetY : sourceY;
        }
      }
    }
  }

  return {
    source:
      source.type === 'cornerNode'
        ? {
            x: source.position.x + (source.width ?? 0),
            y: source.position.y,
          }
        : {
            x: sourceX,
            y: sourceY,
          },
    target:
      target.type === 'cornerNode'
        ? {
            x: target.position.x + (target.width ?? 0),
            y: target.position.y,
          }
        : {
            x: targetX,
            y: targetY,
          },
  };
}

export function getEdgeParams(source?: Node, target?: Node) {
  if (!source || !target) {
    return {
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0,
    };
  }

  const points = getPoints(source, target);

  return {
    sx: points.source.x,
    sy: points.source.y,
    tx: points.target.x,
    ty: points.target.y,
  };
}

// Disabling warnings to match the React Flow node specs
export function generatePositionsPayload(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: Node<any>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edges: Edge<any>[]
): VisualizationPutType[] {
  if (!nodes || nodes.length < 1) {
    return [];
  }

  return nodes.map((node) => {
    const referenceTargets = edges
      .filter((edge) => edge.source === node.id)
      .map((edge) => {
        if (
          edge.target.startsWith('#corner') ||
          (edge.source.startsWith('#corner') &&
            !edge.target.startsWith('#corner'))
        ) {
          return edge.target.replace('#corner', 'corner');
        }
      })
      .filter((value) => typeof value === 'string' && value !== '') as string[];

    return {
      identifier: node.id.startsWith('#corner')
        ? node.id.replace('#corner', 'corner')
        : node.id,
      x: node.position.x,
      y: node.position.y,
      referenceTargets: referenceTargets,
    };
  });
}
