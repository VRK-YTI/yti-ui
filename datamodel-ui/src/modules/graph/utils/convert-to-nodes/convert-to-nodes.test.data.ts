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

export const convertedExpected = [
  {
    id: '1',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '1',
      label: {
        fi: 'label-1-fi',
        en: 'label-1-en',
      },
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '2',
      label: {
        en: 'label-2-en',
      },
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '3',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '3',
      label: {
        fi: 'label-3-fi',
        en: 'label-3-en',
        sv: 'label-3-sv',
      },
      resources: [
        {
          identifier: '3-1',
          label: {
            fi: 'attr-1-fi',
            en: 'attr-1-en',
            sv: 'attr-1-sv',
          },
          type: 'ATTRIBUTE',
        },
      ],
    },
    type: 'classNode',
  },
];

export const convertedWithHiddenExpected = [
  {
    id: '1',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '1',
      label: {
        fi: 'label-1-fi',
        en: 'label-1-en',
      },
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '2',
      label: {
        en: 'label-2-en',
      },
      resources: [],
    },
    type: 'classNode',
  },
  {
    id: '3',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      identifier: '3',
      label: {
        fi: 'label-3-fi',
        en: 'label-3-en',
        sv: 'label-3-sv',
      },
      resources: [
        {
          identifier: '3-1',
          label: {
            fi: 'attr-1-fi',
            en: 'attr-1-en',
            sv: 'attr-1-sv',
          },
          type: 'ATTRIBUTE',
        },
      ],
    },
    type: 'classNode',
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
