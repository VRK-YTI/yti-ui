import { SearchInternalClasses } from '@app/common/interfaces/search-internal-classes.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { NodeTypes } from 'reactflow';

export function generateNodesMock(size?: number) {
  const spread = Math.floor(Math.sqrt(size ?? 3));

  return Array.from(Array(size ?? 3)).map((_, idx) => ({
    id: `node-${idx + 1}`,
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
      id: `edge-${idx + 1}-${target}`,
      source: `node-${idx + 1}`,
      target: `node-${target}`,
      type: 'associationEdge',
      label: `edge-${idx + 1}-${target}`,
    };
  });
}

export function convertToNodes(data: SearchInternalClasses) {
  const objects = data.responseObjects;

  const size = objects.length;
  const spread = Math.floor(Math.sqrt(size));

  return objects.map((obj, idx) => ({
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
