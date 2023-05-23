import { VisualizationType } from '@app/common/interfaces/visualization.interface';
import { Edge, MarkerType } from 'reactflow';

export const visualizationTypeArray: VisualizationType[] = [
  {
    identifier: '1',
    label: {
      fi: 'label-1-fi',
      en: 'label-1-en',
    },
    parentClasses: [],
    position: {
      x: 0,
      y: 0,
    },
    attributes: [],
    associations: [
      {
        identifier: 'association-1',
        label: {
          fi: 'assoc-1-fi',
          en: 'assoc-1-en',
        },
        path: ['2'],
      },
    ],
  },
  {
    identifier: '2',
    label: {
      en: 'label-2-en',
    },
    parentClasses: [],
    position: {
      x: 0,
      y: 0,
    },
    attributes: [],
    associations: [
      {
        identifier: 'association-2',
        label: {
          en: 'assoc-2-en',
        },
        path: ['3'],
      },
    ],
  },
  {
    identifier: '3',
    label: {
      fi: 'label-3-fi',
      en: 'label-3-en',
      sv: 'label-3-sv',
    },
    parentClasses: [],
    position: {
      x: 0,
      y: 0,
    },
    attributes: [
      {
        identifier: '3-1',
        label: {
          fi: 'attr-1-fi',
          en: 'attr-1-en',
          sv: 'attr-1-sv',
        },
      },
    ],
    associations: [],
  },
];

export const twoEdgesOneSplit: Edge[] = [
  {
    source: 'class-1',
    sourceHandle: 'class-1',
    target: 'class-3',
    targetHandle: 'class-3',
    type: 'associationEdge',
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      height: 30,
      width: 30,
    },
    label: 'Association',
    data: {},
    id: 'reactflow__edge-class-1-class-3',
  },
  {
    source: 'corner-12312312',
    sourceHandle: 'corner-12312312',
    target: 'class-3',
    targetHandle: 'class-3',
    type: 'associationEdge',
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      height: 30,
      width: 30,
    },
    label: 'Assosiaatio',
    data: {},
    id: 'reactflow__edge-corner-12312312-class-3',
  },
  {
    source: 'class-2',
    sourceHandle: 'class-2',
    target: 'corner-12312312',
    targetHandle: 'corner-12312312',
    type: 'defaultEdge',
    data: {},
    id: 'reactflow__edge-class-2-#corner-corner-12312312',
  },
];

export const threeEdgesOneMultipleSplit: Edge[] = [
  {
    source: 'class-1',
    sourceHandle: 'class-1',
    target: 'class-4',
    targetHandle: 'class-4',
    type: 'associationEdge',
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      height: 30,
      width: 30,
    },
    label: 'Association',
    data: {},
    id: 'reactflow__edge-class-1-class-4',
  },
  {
    source: 'class-2',
    sourceHandle: 'class-2',
    target: 'class-4',
    targetHandle: 'class-4',
    type: 'associationEdge',
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      height: 30,
      width: 30,
    },
    label: 'Association',
    data: {},
    id: 'reactflow__edge-class-2-class-4',
  },
  {
    source: 'corner-4',
    sourceHandle: 'corner-4',
    target: 'class-4',
    targetHandle: 'class-4',
    type: 'associationEdge',
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      height: 30,
      width: 30,
    },
    label: 'Assosiaatio',
    data: {},
    id: 'reactflow__edge-corner-4-class-4',
  },
  {
    source: 'corner-3',
    sourceHandle: 'corner-3',
    target: 'corner-4',
    targetHandle: 'corner-4',
    type: 'defaultEdge',
    data: {},
    id: 'reactflow__edge-corner-3-#corner-corner-4',
  },
  {
    source: 'corner-2',
    sourceHandle: 'corner-2',
    target: 'corner-3',
    targetHandle: 'corner-3',
    type: 'defaultEdge',
    data: {},
    id: 'reactflow__edge-corner-2-#corner-corner-3',
  },
  {
    source: 'corner-1',
    sourceHandle: 'corner-1',
    target: 'corner-2',
    targetHandle: 'corner-2',
    type: 'defaultEdge',
    data: {},
    id: 'reactflow__edge-corner-1-#corner-corner-2',
  },
  {
    source: 'class-3',
    sourceHandle: 'class-3',
    target: 'corner-1',
    targetHandle: 'corner-1',
    type: 'defaultEdge',
    data: {},
    id: 'reactflow__edge-class-3-#corner-corner-1',
  },
];

// Convert test expected results
export const convertedExpected = [
  {
    id: '1',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '1',
      label: 'label-1-fi',
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 200,
    },
    data: {
      identifier: '2',
      label: 'label-2-en (en)',
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '3',
    position: {
      x: 0,
      y: 400,
    },
    data: {
      identifier: '3',
      label: 'label-3-fi',
      resources: [
        {
          identifier: '3-1',
          label: 'attr-1-fi',
        },
      ],
    },
    type: 'classNode',
  },
];

export const convertedLangVersionedExpected = [
  {
    id: '1',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '1',
      label: 'label-1-en',
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 200,
    },
    data: {
      identifier: '2',
      label: 'label-2-en',
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '3',
    position: {
      x: 0,
      y: 400,
    },
    data: {
      identifier: '3',
      label: 'label-3-en',
      resources: [
        {
          identifier: '3-1',
          label: 'attr-1-en',
        },
      ],
    },
    type: 'classNode',
  },
];

// Connected edges expected results
export const connectedEdgesRemoved: string[] = [
  'reactflow__edge-corner-12312312-class-3',
  'reactflow__edge-class-2-#corner-corner-12312312',
];

export const connectedEdgesRemovedMultiple: string[] = [
  'reactflow__edge-corner-4-class-4',
  'reactflow__edge-corner-3-#corner-corner-4',
  'reactflow__edge-corner-2-#corner-corner-3',
  'reactflow__edge-corner-1-#corner-corner-2',
  'reactflow__edge-class-3-#corner-corner-1',
];

// Initial edges results
export function initialEdges(handleDelete: jest.Mock, splitEdge: jest.Mock) {
  return [
    {
      source: '1',
      sourceHandle: '1',
      target: '2',
      targetHandle: '2',
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        height: 30,
        width: 30,
      },
      label: 'assoc-1-fi',
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
      },
      id: 'reactflow__edge-1-2',
    },
    {
      source: '2',
      sourceHandle: '2',
      target: '3',
      targetHandle: '3',
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        height: 30,
        width: 30,
      },
      label: 'assoc-2-en (en)',
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
      },
      id: 'reactflow__edge-2-3',
    },
  ];
}
