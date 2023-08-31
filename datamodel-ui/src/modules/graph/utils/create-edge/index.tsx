import { Edge, MarkerType } from 'reactflow';

interface CreateEdgeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  applicationProfile?: boolean;
  identifier?: string;
  isCorner?: boolean;
  label?: { [key: string]: string };
  offsetSource?: number;
  handleDelete: (id: string, source: string, target: string) => void;
  splitEdge: (source: string, target: string, x: number, y: number) => void;
}

export default function createEdge({
  params,
  applicationProfile,
  identifier,
  isCorner,
  label,
  offsetSource,
  handleDelete,
  splitEdge,
}: CreateEdgeProps): Edge {
  return {
    ...params,
    type: 'generalEdge',
    markerEnd: getMarkerEnd(applicationProfile, isCorner),
    data: {
      ...params?.data,
      handleDelete: handleDelete,
      splitEdge: splitEdge,
      ...(label ? { label: label } : {}),
      ...(identifier ? { identifier: identifier } : {}),
      ...(offsetSource ? { offsetSource: offsetSource } : {}),
      ...(applicationProfile ? { applicationProfile: true } : {}),
    },
    ...getAdditionalStyles(applicationProfile),
  };
}

function getMarkerEnd(applicationProfile?: boolean, isCorner?: boolean) {
  if (isCorner) {
    return undefined;
  }

  if (applicationProfile) {
    return 'clearArrow';
  }

  return {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
    fill: '#222',
  };
}

function getAdditionalStyles(applicationProfile?: boolean) {
  if (!applicationProfile) {
    return undefined;
  }

  return {
    style: {
      strokeDasharray: '4 2',
      stroke: '#235A9A',
    },
  };
}
