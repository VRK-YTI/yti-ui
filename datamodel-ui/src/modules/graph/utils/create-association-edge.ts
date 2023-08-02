import { Edge, MarkerType } from 'reactflow';

// params needs to be typed as "any" to correlate with specs of React Flow edge parameters

export function createAssociationEdge(
  label: { [key: string]: string },
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  identifier: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
  applicationProfile?: boolean
): Edge {
  return applicationProfile
    ? createDottedEdge(label, handleDelete, splitEdge, identifier, params)
    : createSolidEdge(label, handleDelete, splitEdge, identifier, params);
}

export function createSolidEdge(
  label: { [key: string]: string },
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  identifier: string,
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
    data: {
      ...params.data,
      label: label,
      handleDelete: handleDelete,
      splitEdge: splitEdge,
      identifier: identifier,
    },
  };
}

export function createDottedEdge(
  label: { [key: string]: string },
  handleDelete: (id: string, source: string, target: string) => void,
  splitEdge: (source: string, target: string, x: number, y: number) => void,
  identifier: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
) {
  return {
    ...params,
    type: 'dottedEdge',
    markerEnd: 'clearArrow',
    data: {
      ...params.data,
      label: label,
      handleDelete: handleDelete,
      splitEdge: splitEdge,
      identifier: identifier,
    },
    style: {
      strokeDasharray: '4 2',
      stroke: '#235A9A',
    },
  };
}
