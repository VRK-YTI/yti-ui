import { EdgeDataType } from '@app/common/interfaces/graph.interface';
import { Edge, MarkerType } from 'reactflow';

interface CreateEdgeProps {
  params: {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  };
  applicationProfile?: boolean;
  identifier?: string;
  isCorner?: boolean;
  label?: { [key: string]: string };
  offsetSource?: number;
}

export default function createEdge({
  params,
  applicationProfile,
  identifier,
  isCorner,
  label,
  offsetSource,
}: CreateEdgeProps): Edge<EdgeDataType> {
  return {
    ...params,
    type: 'generalEdge',
    markerEnd: getMarkerEnd(applicationProfile, isCorner),
    data: {
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
    color: '#212121',
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
