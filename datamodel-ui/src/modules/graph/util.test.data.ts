import {
  VisualizationType,
  VisualizationHiddenNode,
} from '@app/common/interfaces/visualization.interface';
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
        referenceTarget: '2',
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
        referenceTarget: '3',
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

export const visualizationTypeArrayWithHidden: VisualizationType[] = [
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
        referenceTarget: 'corner-1',
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
        referenceTarget: 'corner-2',
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

export const visualizationHiddenTypeArray: VisualizationHiddenNode[] = [
  {
    identifier: 'corner-1',
    position: {
      x: 0,
      y: 0,
    },
    referenceTarget: '2',
  },
  {
    identifier: 'corner-2',
    position: {
      x: 0,
      y: 0,
    },
    referenceTarget: '1',
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
    id: '1-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '1',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 40,
    },
    selectable: false,
  },
  {
    id: '1',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '1',
      label: {
        fi: 'label-1-fi',
        en: 'label-1-en',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '1-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '2-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '2',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 40,
    },
    selectable: false,
  },
  {
    id: '2',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '2',
      label: {
        en: 'label-2-en',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '2-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '3-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '3',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 75,
    },
    selectable: false,
  },
  {
    id: '3',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '3',
      label: {
        fi: 'label-3-fi',
        en: 'label-3-en',
        sv: 'label-3-sv',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '3-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '3-1',
    position: {
      x: 5,
      y: 40,
    },
    data: {
      identifier: '3-1',
      label: {
        fi: 'attr-1-fi',
        en: 'attr-1-en',
        sv: 'attr-1-sv',
      },
      type: 'ATTRIBUTE',
      applicationProfile: undefined,
    },
    type: 'resourceNode',
    parentNode: '3-wrapper',
    extent: 'parent',
    draggable: false,
  },
];

export const convertedWithHiddenExpected = [
  {
    id: '1-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '1',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 40,
    },
    selectable: false,
  },
  {
    id: '1',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '1',
      label: {
        fi: 'label-1-fi',
        en: 'label-1-en',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '1-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '2-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '2',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 40,
    },
    selectable: false,
  },
  {
    id: '2',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '2',
      label: {
        en: 'label-2-en',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '2-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '3-wrapper',
    type: 'classWrapperNode',
    data: {
      classId: '3',
    },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 370,
      height: 75,
    },
    selectable: false,
  },
  {
    id: '3',
    position: {
      x: 5,
      y: 5,
    },
    data: {
      identifier: '3',
      label: {
        fi: 'label-3-fi',
        en: 'label-3-en',
        sv: 'label-3-sv',
      },
      applicationProfile: undefined,
    },
    type: 'classNode',
    parentNode: '3-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '3-1',
    position: {
      x: 5,
      y: 40,
    },
    data: {
      identifier: '3-1',
      label: {
        fi: 'attr-1-fi',
        en: 'attr-1-en',
        sv: 'attr-1-sv',
      },
      type: 'ATTRIBUTE',
      applicationProfile: undefined,
    },
    type: 'resourceNode',
    parentNode: '3-wrapper',
    extent: 'parent',
    draggable: false,
  },
  {
    id: '#corner-1',
    position: {
      x: 0,
      y: 0,
    },
    data: {},
    type: 'cornerNode',
  },
  {
    id: '#corner-2',
    position: {
      x: 0,
      y: 0,
    },
    data: {},
    type: 'cornerNode',
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
        height: 20,
        width: 20,
        color: '#222',
      },
      label: 'assoc-1-fi',
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
        identifier: 'association-1',
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
        height: 20,
        width: 20,
        color: '#222',
      },
      label: 'assoc-2-en (en)',
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
        identifier: 'association-2',
      },
      id: 'reactflow__edge-2-3',
    },
  ];
}

export function initialEdgesWithHidden(
  handleDelete: jest.Mock,
  splitEdge: jest.Mock
) {
  return [
    {
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
      },
      source: '1',
      sourceHandle: '1',
      target: '#corner-1',
      targetHandle: '#corner-1',
      type: 'defaultEdge',
      id: 'reactflow__edge-1-#corner-#corner-1',
    },
    {
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
      },
      source: '2',
      sourceHandle: '2',
      target: '#corner-2',
      targetHandle: '#corner-2',
      type: 'defaultEdge',
      id: 'reactflow__edge-2-#corner-#corner-2',
    },
    {
      source: '#corner-1',
      sourceHandle: '#corner-1',
      target: '2',
      targetHandle: '2',
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        height: 20,
        width: 20,
        color: '#222',
      },
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
        identifier: '2',
      },
      id: 'reactflow__edge-#corner-1-2',
      label: 'label-2-en (en)',
    },
    {
      source: '#corner-2',
      sourceHandle: '#corner-2',
      target: '1',
      targetHandle: '1',
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        height: 20,
        width: 20,
        color: '#222',
      },
      data: {
        handleDelete: handleDelete,
        splitEdge: splitEdge,
        identifier: '1',
      },
      id: 'reactflow__edge-#corner-2-1',
      label: 'label-1-fi',
    },
  ];
}

export const noCornerNodes = [
  {
    data: {
      identifier: 'class-1',
      label: 'Class 1',
      resources: [],
    },
    height: 10,
    id: 'class-1',
    position: {
      x: 0,
      y: 0,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {
      identifier: 'class-2',
      label: 'Class 2',
      resources: [],
    },
    height: 10,
    id: 'class-2',
    position: {
      x: 0,
      y: 100,
    },
    type: 'classNode',
    width: 10,
  },
];

export const noCornerEdges = [
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
      identifier: 'association-1',
    },
    id: 'reactflow__edge-class-1-class-2',
    label: 'Association 1',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    source: 'class-1',
    sourceHandle: 'class-1',
    target: 'class-2',
    targetHandle: 'class-2',
    type: 'associationEdge',
  },
];

export const oneCornerNodes = [
  {
    data: {
      identifier: 'class-1',
      label: 'Class 1',
      resources: [],
    },
    height: 10,
    id: 'class-1',
    position: {
      x: 0,
      y: 0,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {
      identifier: 'class-2',
      label: 'Class 2',
      resources: [],
    },
    height: 10,
    id: 'class-2',
    position: {
      x: 0,
      y: 100,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {},
    height: 10,
    id: '#corner-12345678',
    position: {
      x: 5,
      y: 50,
    },
    type: 'cornerNode',
    width: 10,
  },
];

export const oneCornerEdges = [
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
      identifier: 'association-1',
    },
    id: 'reactflow__edge-#corner-12345678-class-2',
    label: 'Association 1',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    source: '#corner-12345678',
    sourceHandle: '#corner-12345678',
    target: 'class-2',
    targetHandle: 'class-2',
    type: 'associationEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
    },
    id: 'reactflow__edge-class-1-#corner-12345678',
    source: 'class-1',
    sourceHandle: 'class-1',
    target: '#corner-12345678',
    targetHandle: '#corner-12345678',
    type: 'defaultEdge',
  },
];

export const twoCornerNodes = [
  {
    data: {
      identifier: 'class-1',
      label: 'Class 1',
      resources: [],
    },
    height: 10,
    id: 'class-1',
    position: {
      x: 0,
      y: 0,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {
      identifier: 'class-2',
      label: 'Class 2',
      resources: [],
    },
    height: 10,
    id: 'class-2',
    position: {
      x: 0,
      y: 100,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {},
    height: 10,
    id: '#corner-12345678',
    position: {
      x: 5,
      y: 50,
    },
    type: 'cornerNode',
    width: 10,
  },
  {
    data: {},
    height: 10,
    id: '#corner-87654321',
    position: {
      x: 15,
      y: 50,
    },
    type: 'cornerNode',
    width: 10,
  },
];

export const twoCornerEdges = [
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
    },
    id: 'reactflow__edge-class-1-#corner-12345678',
    source: 'class-1',
    sourceHandle: 'class-1',
    target: '#corner-12345678',
    targetHandle: '#corner-12345678',
    type: 'defaultEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
    },
    id: 'reactflow__edge-#corner-12345678-#corner-87654321',
    source: '#corner-12345678',
    sourceHandle: '#corner-12345678',
    target: '#corner-87654321',
    targetHandle: '#corner-87654321',
    type: 'defaultEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
      identifier: 'association-1',
    },
    id: 'reactflow__edge-#corner-87654321-class-2',
    label: 'Association 1',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    source: '#corner-87654321',
    sourceHandle: '#corner-87654321',
    target: 'class-2',
    targetHandle: 'class-2',
    type: 'associationEdge',
  },
];

export const multipleFromOneCornerNodes = [
  {
    data: {
      identifier: 'class-1',
      label: 'Class 1',
      resources: [],
    },
    height: 10,
    id: 'class-1',
    position: {
      x: 0,
      y: 0,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {
      identifier: 'class-2',
      label: 'Class 2',
      resources: [],
    },
    height: 10,
    id: 'class-2',
    position: {
      x: 0,
      y: 100,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {
      identifier: 'class-3',
      label: 'Class 3',
      resources: [],
    },
    height: 10,
    id: 'class-3',
    position: {
      x: 100,
      y: 100,
    },
    type: 'classNode',
    width: 10,
  },
  {
    data: {},
    height: 10,
    id: '#corner-12345678',
    position: {
      x: 5,
      y: 50,
    },
    type: 'cornerNode',
    width: 10,
  },
  {
    data: {},
    height: 10,
    id: '#corner-87654321',
    position: {
      x: 50,
      y: 50,
    },
    type: 'cornerNode',
    width: 10,
  },
];

export const multipleFromOneCornerEdges = [
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
    },
    id: 'reactflow__edge-class-1-#corner-12345678',
    source: 'class-1',
    sourceHandle: 'class-1',
    target: '#corner-12345678',
    targetHandle: '#corner-12345678',
    type: 'defaultEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
    },
    id: 'reactflow__edge-class-1-#corner-87654321',
    source: 'class-1',
    sourceHandle: 'class-1',
    target: '#corner-87654321',
    targetHandle: '#corner-87654321',
    type: 'defaultEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
      identifier: 'association-1',
    },
    id: 'reactflow__edge-#corner-12345678-class-2',
    label: 'Association 1',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    source: '#corner-12345678',
    sourceHandle: '#corner-12345678',
    target: 'class-2',
    targetHandle: 'class-2',
    type: 'associationEdge',
  },
  {
    data: {
      handleDelete: jest.fn(),
      splitEdge: jest.fn(),
      identifier: 'association-2',
    },
    id: 'reactflow__edge-#corner-87654321-class-3',
    label: 'Association 2',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      height: 20,
      width: 20,
      color: '#222',
    },
    source: '#corner-87654321',
    sourceHandle: '#corner-87654321',
    target: 'class-3',
    targetHandle: 'class-3',
    type: 'associationEdge',
  },
];
