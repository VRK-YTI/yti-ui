export function generateNodesMock(size?: number) {
  const spread = Math.floor(Math.sqrt(size ?? 3));

  return Array.from(Array(size ?? 3)).map((_, idx) => ({
    id: `node-${idx + 1}`,
    position: { x: 400 * (idx % spread), y: 300 * Math.floor(idx / spread) },
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
  const max = maxRange * (maxRange - 1);
  const min = Math.round(maxRange / 2);

  return Array.from(Array(Math.floor(Math.random() * (max - min) + min)))
    .map((_, idx) => {
      const target = Math.floor(Math.random() * maxRange);

      return {
        id: `edge-${idx + 1}-${target}`,
        source: `node-${idx + 1}`,
        target: `node-${target}`,
        type: 'step',
      };
    })
    .filter((val) => val);
}
