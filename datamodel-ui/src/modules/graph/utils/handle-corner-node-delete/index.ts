import { Edge, Node } from 'reactflow';
import createEdge from '../create-edge';

export default function handleCornerNodeDelete(
  id: string,
  setNodes: (data: Node[] | ((data: Node[]) => Node[])) => void,
  setEdges: (data: Edge[] | ((data: Edge[]) => Edge[])) => void,
  applicationProfile?: boolean
) {
  setNodes((nodes) => nodes.filter((node) => node.id !== id));

  setEdges((edges: Edge[]) => {
    const inputEdge = edges.find((e) => e.target === id);
    const outputEdge = edges.find((e) => e.source === id);

    if (!inputEdge || !outputEdge) {
      return edges;
    }

    const sourceNode = inputEdge.source;
    const targetNode = outputEdge.target;

    if (!outputEdge.target.startsWith('#corner')) {
      return edges
        .filter((edge) => edge.target !== id)
        .map((edge) => {
          if (edge.id === outputEdge.id) {
            return {
              ...edge,
              source: sourceNode,
              sourceHandle: sourceNode,
              target: targetNode,
              targetHandle: targetNode,
            };
          }

          return edge;
        });
    }

    const newEdge = createEdge({
      params: {
        source: sourceNode,
        sourceHandle: sourceNode,
        target: targetNode,
        targetHandle: targetNode,
        id: `reactflow__edge-${sourceNode}-${targetNode}`,
      },
      isCorner: true,
      applicationProfile: applicationProfile ? true : false,
    });

    return [
      ...edges.filter((edge) => edge.target !== id && edge.source !== id),
      newEdge,
    ];
  });
}
