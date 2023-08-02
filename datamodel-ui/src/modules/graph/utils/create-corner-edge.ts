export function createCornerEdge(source: string, target: string, data: object) {
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
