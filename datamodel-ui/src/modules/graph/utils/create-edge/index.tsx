import { EdgeDataType } from '@app/common/interfaces/graph.interface';
import { ReferenceType } from '@app/common/interfaces/visualization.interface';
import { Edge, MarkerType } from 'reactflow';

interface CreateEdgeProps {
  params: {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    referenceType?: ReferenceType;
  };
  applicationProfile?: boolean;
  identifier?: string;
  isCorner?: boolean;
  label?: { [key: string]: string } | string;
  offsetSource?: number;
  modelId?: string;
}

export default function createEdge({
  params,
  applicationProfile,
  identifier,
  isCorner,
  label,
  offsetSource,
  modelId,
}: CreateEdgeProps): Edge<EdgeDataType> {
  return {
    ...params,
    type: 'generalEdge',
    markerEnd: getMarkerEnd(isCorner, params.referenceType),
    data: {
      ...(modelId ? { modelId: modelId } : {}),
      ...(label ? { label: label } : {}),
      ...(identifier ? { identifier: identifier } : {}),
      ...(offsetSource ? { offsetSource: offsetSource } : {}),
      ...(applicationProfile ? { applicationProfile: true } : {}),
    },
    ...getAdditionalStyles(params.referenceType),
  };
}

function getMarkerEnd(isCorner?: boolean, referenceType?: ReferenceType) {
  if (isCorner) {
    return undefined;
  }

  if (referenceType === 'PARENT_CLASS') {
    return 'clearArrow';
  }

  return {
    type: MarkerType.ArrowClosed,
    height: 20,
    width: 20,
    color: '#212121',
  };
}

function getAdditionalStyles(referenceType?: ReferenceType) {
  return referenceType === 'PARENT_CLASS'
    ? {
        style: {
          strokeDasharray: '4 2',
          stroke: '#235A9A',
        },
      }
    : {};
}
