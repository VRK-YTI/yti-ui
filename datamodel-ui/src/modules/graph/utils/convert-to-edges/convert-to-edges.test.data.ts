import {
  VisualizationHiddenNode,
  VisualizationType,
} from '@app/common/interfaces/visualization.interface';

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
          fi: 'assoc-1-2-fi',
          en: 'assoc-1-2-en',
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
    associations: [],
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
    attributes: [],
    associations: [],
  },
  {
    identifier: '4',
    label: {
      fi: 'label-4-fi',
    },
    parentClasses: [],
    position: {
      x: 0,
      y: 0,
    },
    attributes: [],
    associations: [
      {
        identifier: 'association-4',
        label: {
          fi: 'assoc-4-3-fi',
        },
        referenceTarget: '3',
      },
    ],
  },
];

export const visualizationHiddenTypeArray: VisualizationHiddenNode[] = [
  {
    identifier: 'corner-1',
    position: {
      x: 0,
      y: 10,
    },
    referenceTarget: 'corner-2',
  },
  {
    identifier: 'corner-2',
    position: {
      x: 10,
      y: 10,
    },
    referenceTarget: '3',
  },
];

export const solidEdgeExpected = [
  {
    id: 'reactflow__edge-1-2',
    type: 'generalEdge',
    markerEnd: {
      type: 'arrowclosed',
      height: 20,
      width: 20,
      color: '#212121',
    },
    source: '1',
    sourceHandle: '1',
    target: '2',
    targetHandle: '2',
    data: {
      identifier: 'association-1',
      label: {
        fi: 'assoc-1-2-fi',
        en: 'assoc-1-2-en',
      },
    },
  },
  {
    id: 'reactflow__edge-4-3',
    type: 'generalEdge',
    markerEnd: {
      type: 'arrowclosed',
      height: 20,
      width: 20,
      color: '#212121',
    },
    source: '4',
    sourceHandle: '4',
    target: '3',
    targetHandle: '3',
    data: {
      identifier: 'association-4',
      label: {
        fi: 'assoc-4-3-fi',
      },
    },
  },
];

export const dottedEdgeExpected = [
  {
    id: 'reactflow__edge-1-2',
    type: 'generalEdge',
    markerEnd: 'clearArrow',
    source: '1',
    sourceHandle: '1',
    target: '2',
    targetHandle: '2',
    data: {
      applicationProfile: true,
      identifier: 'association-1',
      label: {
        fi: 'assoc-1-2-fi',
        en: 'assoc-1-2-en',
      },
      offsetSource: 1,
    },
    style: {
      stroke: '#235A9A',
      strokeDasharray: '4 2',
    },
  },
  {
    id: 'reactflow__edge-4-3',
    type: 'generalEdge',
    markerEnd: 'clearArrow',
    source: '4',
    sourceHandle: '4',
    target: '3',
    targetHandle: '3',
    data: {
      applicationProfile: true,
      identifier: 'association-4',
      label: {
        fi: 'assoc-4-3-fi',
      },
      offsetSource: 1,
    },
    style: {
      stroke: '#235A9A',
      strokeDasharray: '4 2',
    },
  },
];

export const hiddenEdgeExpected = [
  {
    id: 'reactflow__edge-#corner-1-#corner-2',
    type: 'generalEdge',
    source: '#corner-1',
    sourceHandle: '#corner-1',
    target: '#corner-2',
    targetHandle: '#corner-2',
    markerEnd: undefined,
    data: {},
  },
  {
    id: 'reactflow__edge-#corner-2-3',
    type: 'generalEdge',
    markerEnd: {
      type: 'arrowclosed',
      height: 20,
      width: 20,
      color: '#212121',
    },
    source: '#corner-2',
    sourceHandle: '#corner-2',
    target: '3',
    targetHandle: '3',
    data: {
      identifier: '3',
      label: {
        fi: 'label-3-fi',
        en: 'label-3-en',
        sv: 'label-3-sv',
      },
    },
  },
];
