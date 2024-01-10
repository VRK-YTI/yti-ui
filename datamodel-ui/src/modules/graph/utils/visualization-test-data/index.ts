import { VisualizationResult } from '@app/common/interfaces/visualization.interface';

export const libraryData = {
  nodes: [
    {
      identifier: 'address',
      label: { fi: 'Osoite' },
      uri: 'uri-address',
      position: { x: 813, y: -93 },
      type: 'CLASS',
      references: [],
      attributes: [],
      associations: [],
    },
    {
      identifier: 'ext:spouse',
      label: { fi: 'ext:spouse' },
      position: { x: 682, y: 196 },
      type: 'EXTERNAL_CLASS',
      references: [],
      attributes: [],
      associations: [],
    },
    {
      identifier: 'person',
      label: { fi: 'Henkilö' },
      position: { x: 156, y: -82 },
      type: 'CLASS',
      references: [
        {
          identifier: 'is-address',
          label: {
            fi: 'onOsoite',
          },
          referenceTarget: 'address',
          referenceType: 'ASSOCIATION',
        },
      ],
      attributes: [
        {
          identifier: 'age',
          label: {
            fi: 'Ikä',
          },
          dataType: 'xsd:integer',
        },
        {
          identifier: 'gender',
          label: {
            fi: 'Sukupuoli',
          },
          dataType: 'xsd:string',
        },
      ],
      associations: [
        {
          identifier: 'is-spouse',
          label: {
            fi: 'onPuoliso',
          },
          referenceTarget: 'corner-2',
          referenceType: 'ASSOCIATION',
        },
      ],
    },
    {
      identifier: 'name',
      label: { fi: 'Nimi' },
      position: { x: 545, y: -163 },
      type: 'ATTRIBUTE',
      references: [
        {
          identifier: 'person',
          label: undefined,
          referenceTarget: 'corner-3',
          referenceType: 'ATTRIBUTE_DOMAIN',
        },
      ],
      dataType: 'rdfs:Literal',
    },
    {
      identifier: 'natural-person',
      label: { fi: 'Luonnollinen henkilö' },
      position: { x: 166, y: 232 },
      type: 'CLASS',
      references: [
        {
          identifier: 'person',
          label: undefined,
          referenceTarget: 'corner-1',
          referenceType: 'PARENT_CLASS',
        },
      ],
      attributes: [],
      associations: [],
    },
  ],
  hiddenNodes: [
    {
      identifier: 'corner-1',
      position: { x: 85, y: 248 },
      referenceTarget: 'corner-4',
      referenceType: 'PARENT_CLASS',
    },
    {
      identifier: 'corner-2',
      position: { x: 681, y: 51 },
      referenceTarget: 'ext:spouse',
      referenceType: 'ASSOCIATION',
    },
    {
      identifier: 'corner-3',
      position: { x: 409, y: -136 },
      referenceTarget: 'person',
      referenceType: 'ATTRIBUTE_DOMAIN',
    },
    {
      identifier: 'corner-4',
      position: { x: 84, y: 14 },
      referenceTarget: 'person',
      referenceType: 'PARENT_CLASS',
    },
  ],
} as VisualizationResult;

export const profileData = {
  nodes: [
    {
      identifier: 'address',
      label: {
        fi: 'Osoite',
      },
      uri: 'uri-address',
      position: {
        x: 698,
        y: 66,
      },
      type: 'CLASS',
      references: [],
      attributes: [],
      associations: [],
      targetClass: 'visu:address',
    },
    {
      identifier: 'person',
      label: {
        fi: 'Henkilö',
      },
      position: {
        x: 22,
        y: -79,
      },
      type: 'CLASS',
      references: [],
      attributes: [
        {
          identifier: 'gender',
          label: {
            fi: 'Sukupuoli',
          },
          dataType: undefined,
          minCount: undefined,
          maxCount: undefined,
          codeLists: [],
        },
        {
          identifier: 'age',
          label: {
            fi: 'Ikä',
          },
          dataType: undefined,
          minCount: undefined,
          maxCount: undefined,
          codeLists: [],
        },
      ],
      associations: [
        {
          identifier: 'is-address',
          label: {
            fi: 'onOsoite',
          },
          referenceTarget: 'address',
          referenceType: 'ASSOCIATION',
          minCount: undefined,
          maxCount: undefined,
        },
      ],
      targetClass: 'visu:person',
    },
    {
      identifier: 'natural-person',
      label: {
        fi: 'Luonnollinen henkilö',
      },
      position: {
        x: 273,
        y: 306,
      },
      type: 'CLASS',
      references: [
        {
          identifier: 'person',
          label: {},
          referenceTarget: 'corner-1',
          referenceType: 'PARENT_CLASS',
        },
      ],
      attributes: [
        {
          identifier: 'gender',
          label: {
            fi: 'Sukupuoli',
          },
          dataType: undefined,
          minCount: undefined,
          maxCount: undefined,
          codeLists: [],
        },
        {
          identifier: 'age',
          label: {
            fi: 'Ikä',
          },
          dataType: undefined,
          minCount: undefined,
          maxCount: undefined,
          codeLists: [],
        },
      ],
      associations: [
        {
          identifier: 'is-address',
          label: {
            fi: 'onOsoite',
          },
          referenceTarget: 'corner-2',
          referenceType: 'ASSOCIATION',
          minCount: undefined,
          maxCount: undefined,
        },
      ],
      targetClass: 'visu:natural-person',
    },
  ],
  hiddenNodes: [
    {
      identifier: 'corner-1',
      position: {
        x: 30,
        y: 323,
      },
      referenceTarget: 'person',
      referenceType: 'PARENT_CLASS',
    },
    {
      identifier: 'corner-2',
      position: {
        x: 962,
        y: 432,
      },
      referenceTarget: 'address',
      referenceType: 'ASSOCIATION',
    },
  ],
} as VisualizationResult;

/**
 * Library edges contains:
 * - association (with domain and range) from person to address, no corners, label 'onOsoite' is shown
 * - parent class relation from natural-person to person via corner-1 and corner-4, line style 'dashed'
 * - attribute (:name rdfs:domain :person) name with relation to person via corner-3
 * - association restriction (owl:someValuesFrom) relation from person to ext:spouse, no label is shown
 */
export const expectedLibraryEdges = {
  edges: [
    {
      source: 'person',
      sourceHandle: 'person',
      target: '#corner-2',
      targetHandle: '#corner-2',
      id: 'reactflow__edge-person-#corner-2',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: undefined,
      data: { offsetSource: 3 },
    },
    {
      source: 'person',
      sourceHandle: 'person',
      target: 'address',
      targetHandle: 'address',
      id: 'reactflow__edge-person-address',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#212121',
      },
      data: {
        label: { fi: 'onOsoite' },
        identifier: 'is-address',
        modelId: 'modelId',
      },
    },
    {
      source: 'name',
      sourceHandle: 'name',
      target: '#corner-3',
      targetHandle: '#corner-3',
      id: 'reactflow__edge-name-#corner-3',
      referenceType: 'ATTRIBUTE_DOMAIN',
      type: 'generalEdge',
      markerEnd: undefined,
      data: {},
    },
    {
      source: 'natural-person',
      sourceHandle: 'natural-person',
      target: '#corner-1',
      targetHandle: '#corner-1',
      id: 'reactflow__edge-natural-person-#corner-1',
      referenceType: 'PARENT_CLASS',
      type: 'generalEdge',
      markerEnd: undefined,
      data: {},
      style: { strokeDasharray: '4 2', stroke: '#235A9A' },
    },
    {
      source: '#corner-1',
      sourceHandle: '#corner-1',
      target: '#corner-4',
      targetHandle: '#corner-4',
      id: 'reactflow__edge-#corner-1-#corner-4',
      referenceType: 'PARENT_CLASS',
      type: 'generalEdge',
      markerEnd: undefined,
      data: {},
      style: { strokeDasharray: '4 2', stroke: '#235A9A' },
    },
    {
      source: '#corner-2',
      sourceHandle: '#corner-2',
      target: 'ext:spouse',
      targetHandle: 'ext:spouse',
      id: 'reactflow__edge-#corner-2-ext:spouse',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#212121',
      },
      data: {},
    },
    {
      source: '#corner-3',
      sourceHandle: '#corner-3',
      target: 'person',
      targetHandle: 'person',
      id: 'reactflow__edge-#corner-3-person',
      referenceType: 'ATTRIBUTE_DOMAIN',
      type: 'generalEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#212121',
      },
      data: { identifier: 'name' },
    },
    {
      source: '#corner-4',
      sourceHandle: '#corner-4',
      target: 'person',
      targetHandle: 'person',
      id: 'reactflow__edge-#corner-4-person',
      referenceType: 'PARENT_CLASS',
      type: 'generalEdge',
      markerEnd: 'clearArrow',
      data: { identifier: 'natural-person' },
      style: { strokeDasharray: '4 2', stroke: '#235A9A' },
    },
  ],
  loopNodes: [],
};

/**
 * Profile edges contains
 * - parent relation (sh:node) natural-person to person via corner-1, dashed line with open arrow, label 'utilizes'
 * - association relation from both person and natural-person to address, the latter one via corner-2, label 'targets'
 */
export const expectedProfileEdges = {
  edges: [
    {
      source: 'person',
      sourceHandle: 'person',
      target: 'address',
      targetHandle: 'address',
      id: 'reactflow__edge-person-address',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: {
        color: '#212121',
        height: 20,
        type: 'arrowclosed',
        width: 20,
      },
      data: {
        identifier: 'is-address',
        offsetSource: 3,
        applicationProfile: true,
      },
    },
    {
      source: 'natural-person',
      sourceHandle: 'natural-person',
      target: '#corner-2',
      targetHandle: '#corner-2',
      id: 'reactflow__edge-natural-person-#corner-2',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: undefined,
      data: { offsetSource: 3, applicationProfile: true },
    },
    {
      source: 'natural-person',
      sourceHandle: 'natural-person',
      target: '#corner-1',
      targetHandle: '#corner-1',
      id: 'reactflow__edge-natural-person-#corner-1',
      referenceType: 'PARENT_CLASS',
      type: 'generalEdge',
      markerEnd: undefined,
      data: {},
      style: { strokeDasharray: '4 2', stroke: '#235A9A' },
    },
    {
      source: '#corner-1',
      sourceHandle: '#corner-1',
      target: 'person',
      targetHandle: 'person',
      id: 'reactflow__edge-#corner-1-person',
      referenceType: 'PARENT_CLASS',
      type: 'generalEdge',
      markerEnd: 'clearArrow',
      data: {
        identifier: 'natural-person',
        applicationProfile: true,
        label: 'utilizes',
      },
      style: { strokeDasharray: '4 2', stroke: '#235A9A' },
    },
    {
      source: '#corner-2',
      sourceHandle: '#corner-2',
      target: 'address',
      targetHandle: 'address',
      id: 'reactflow__edge-#corner-2-address',
      referenceType: 'ASSOCIATION',
      type: 'generalEdge',
      markerEnd: {
        color: '#212121',
        height: 20,
        type: 'arrowclosed',
        width: 20,
      },
      data: {
        identifier: 'is-address',
        offsetSource: 3,
        applicationProfile: true,
        label: 'targets',
      },
    },
  ],
  loopNodes: [],
};

export function expectedLibraryNodes(handleDeleteFunction: () => void) {
  return [
    {
      id: 'address',
      position: { x: 813, y: -93 },
      data: {
        identifier: 'address',
        modelId: 'visu',
        label: { fi: 'Osoite' },
        resources: [],
        uri: 'uri-address',
      },
      type: 'classNode',
    },
    {
      id: 'ext:spouse',
      position: { x: 682, y: 196 },
      data: { identifier: 'ext:spouse', label: { fi: 'ext:spouse' } },
      type: 'externalNode',
    },
    {
      id: 'person',
      position: { x: 156, y: -82 },
      data: {
        identifier: 'person',
        modelId: 'visu',
        label: { fi: 'Henkilö' },
        uri: undefined,
        resources: [
          {
            dataType: 'xsd:integer',
            identifier: 'age',
            label: {
              fi: 'Ikä',
            },
            type: 'ATTRIBUTE',
          },
          {
            dataType: 'xsd:string',
            identifier: 'gender',
            label: {
              fi: 'Sukupuoli',
            },
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'is-spouse',
            label: {
              fi: 'onPuoliso',
            },
            referenceType: 'ASSOCIATION',
            type: 'ASSOCIATION',
          },
        ],
      },
      type: 'classNode',
    },
    {
      id: 'name',
      position: { x: 545, y: -163 },
      data: {
        identifier: 'name',
        modelId: 'visu',
        label: { fi: 'Nimi' },
        dataType: 'rdfs:Literal',
        uri: undefined,
      },
      type: 'attributeNode',
    },
    {
      id: 'natural-person',
      position: { x: 166, y: 232 },
      data: {
        identifier: 'natural-person',
        modelId: 'visu',
        label: { fi: 'Luonnollinen henkilö' },
        resources: [],
        uri: undefined,
      },
      type: 'classNode',
    },
    {
      id: '#corner-1',
      data: { handleNodeDelete: handleDeleteFunction },
      position: { x: 85, y: 248 },
      type: 'cornerNode',
    },
    {
      id: '#corner-2',
      data: { handleNodeDelete: handleDeleteFunction },
      position: { x: 681, y: 51 },
      type: 'cornerNode',
    },
    {
      id: '#corner-3',
      data: { handleNodeDelete: handleDeleteFunction },
      position: { x: 409, y: -136 },
      type: 'cornerNode',
    },
    {
      id: '#corner-4',
      data: { handleNodeDelete: handleDeleteFunction },
      position: { x: 84, y: 14 },
      type: 'cornerNode',
    },
  ];
}

export function expectedProfilesNodes(handleDeleteFunction: () => void) {
  return [
    {
      id: 'address',
      position: { x: 698, y: 66 },
      data: {
        identifier: 'address',
        modelId: 'visuprof',
        label: { fi: 'Osoite' },
        uri: 'uri-address',
        applicationProfile: true,
        resources: [],
      },
      type: 'classNode',
    },
    {
      id: 'person',
      position: { x: 22, y: -79 },
      data: {
        identifier: 'person',
        modelId: 'visuprof',
        label: { fi: 'Henkilö' },
        uri: undefined,
        applicationProfile: true,
        resources: [
          {
            codeLists: [],
            dataType: undefined,
            identifier: 'gender',
            label: {
              fi: 'Sukupuoli',
            },
            maxCount: undefined,
            minCount: undefined,
            type: 'ATTRIBUTE',
          },
          {
            codeLists: [],
            dataType: undefined,
            identifier: 'age',
            label: {
              fi: 'Ikä',
            },
            maxCount: undefined,
            minCount: undefined,
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'is-address',
            label: {
              fi: 'onOsoite',
            },
            maxCount: undefined,
            minCount: undefined,
            referenceType: 'ASSOCIATION',
            type: 'ASSOCIATION',
          },
        ],
      },
      type: 'classNode',
    },
    {
      id: 'natural-person',
      position: { x: 273, y: 306 },
      data: {
        identifier: 'natural-person',
        modelId: 'visuprof',
        label: { fi: 'Luonnollinen henkilö' },
        uri: undefined,
        applicationProfile: true,
        resources: [
          {
            codeLists: [],
            dataType: undefined,
            identifier: 'gender',
            label: {
              fi: 'Sukupuoli',
            },
            maxCount: undefined,
            minCount: undefined,
            type: 'ATTRIBUTE',
          },
          {
            codeLists: [],
            dataType: undefined,
            identifier: 'age',
            label: {
              fi: 'Ikä',
            },
            maxCount: undefined,
            minCount: undefined,
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'is-address',
            label: {
              fi: 'onOsoite',
            },
            maxCount: undefined,
            minCount: undefined,
            referenceType: 'ASSOCIATION',
            type: 'ASSOCIATION',
          },
        ],
      },
      type: 'classNode',
    },
    {
      id: '#corner-1',
      data: {
        handleNodeDelete: handleDeleteFunction,
        applicationProfile: true,
      },
      position: { x: 30, y: 323 },
      type: 'cornerNode',
    },
    {
      id: '#corner-2',
      data: {
        handleNodeDelete: handleDeleteFunction,
        applicationProfile: true,
      },
      position: { x: 962, y: 432 },
      type: 'cornerNode',
    },
  ];
}
