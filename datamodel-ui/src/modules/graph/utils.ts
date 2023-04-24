import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Edge, MarkerType, Node } from 'reactflow';

export function convertToNodes(data: VisualizationType[]): Node[] {
  const size = data.length;
  const spread = Math.floor(Math.sqrt(size));

  if (size < 1) {
    return [];
  }

  return data.map((obj, idx) => ({
    id: obj.identifier,
    position: { x: 400 * (idx % spread), y: 200 * Math.floor(idx / spread) },
    data: {
      identifier: obj.identifier,
      label: getLanguageVersion({
        data: obj.label,
        lang: 'fi',
        appendLocale: true,
      }),
      resources: [],
    },
    type: 'classNode',
  }));
}

export function getConnectedCornerIds(
  data: Edge[],
  source?: string,
  target?: string
): string[] {
  if (!source || !target) {
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

  if (retVal && newSource && retVal.includes('corner')) {
    return getRelatedEdgeIds(
      data,
      newSource,
      ids
        ? [...ids, retVal]
        : [data.find((edge) => edge.source === source)?.id ?? '']
    );
  }

  return ids
    ? [...ids, data.find((edge) => edge.source === source)?.id ?? '']
    : [data.find((edge) => edge.source === source)?.id ?? ''];
}

/*
  Mock data generators below. Note! Might be outdated
*/

export function generateNodesMock(size?: number) {
  const spread = Math.floor(Math.sqrt(size ?? 3));

  return Array.from(Array(size ?? 3)).map((_, idx) => ({
    id: `${idx + 1}`,
    position: { x: 400 * (idx % spread), y: 200 * Math.floor(idx / spread) },
    data: {
      identifier: (idx + 1).toString(),
      label: (idx + 1).toString(),
      resources: Array.from(Array(Math.floor(Math.random() * 3))).map(
        (_, cIdx) => ({
          identifier: `${idx + 1}-${cIdx + 1}`,
          label: `Attribuutti #${cIdx + 1}`,
        })
      ),
    },
    type: 'classNode',
  }));
}

export function generateEdgesMock(maxRange: number) {
  const min = Math.round(maxRange / 2);

  return Array.from(
    Array(Math.floor(Math.random() * (maxRange - min) + min))
  ).map((_, idx) => {
    const target = Math.floor(Math.random() * maxRange);

    return {
      id: `reactflow__edge-${idx + 1}-${target}`,
      source: `${idx + 1}`,
      target: `${target}`,
      type: 'associationEdge',
      markerEnd: {
        type: MarkerType.Arrow,
      },
      label: `edge-${idx + 1}-${target}`,
    };
  });
}
