import createClassNode from '.';

describe('create-class-node', () => {
  it('should create a simple class node', () => {
    const returned = createClassNode(
      {
        identifier: 'id-1',
        label: {
          fi: 'label-1-fi',
          en: 'label-1-en',
        },
        references: [],
        position: {
          x: 0,
          y: 0,
        },
        attributes: [],
        associations: [],
        type: 'CLASS',
      },
      'modelId'
    );

    expect(returned).toStrictEqual({
      id: 'id-1',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        identifier: 'id-1',
        label: {
          fi: 'label-1-fi',
          en: 'label-1-en',
        },
        modelId: 'modelId',
        resources: [],
      },
      type: 'classNode',
    });
  });

  it('should create a class node with resources', () => {
    const returned = createClassNode(
      {
        identifier: 'id-1',
        type: 'CLASS',
        label: {
          fi: 'label-1-fi',
        },
        references: [],
        position: {
          x: 0,
          y: 0,
        },
        attributes: [
          {
            identifier: 'attr-1',
            label: {
              fi: 'attr-1-fi',
            },
          },
          {
            identifier: 'attr-2',
            label: {
              fi: 'attr-2-fi',
            },
          },
          {
            identifier: 'attr-3',
            label: {
              fi: 'attr-3-fi',
            },
          },
        ],
        associations: [
          {
            identifier: 'assoc-1',
            label: {
              fi: 'assoc-1-fi',
            },
            referenceTarget: 'id-2',
            referenceType: 'ASSOCIATION',
          },
          {
            identifier: 'assoc-2',
            label: {
              fi: 'assoc-2-fi',
            },
            referenceTarget: 'id-3',
            referenceType: 'ASSOCIATION',
          },
          {
            identifier: 'assoc-3',
            label: {
              fi: 'assoc-3-fi',
            },
            referenceTarget: 'id-4',
            referenceType: 'ASSOCIATION',
          },
        ],
      },
      'modelId',
      true
    );

    expect(returned).toStrictEqual({
      id: 'id-1',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        identifier: 'id-1',
        label: {
          fi: 'label-1-fi',
        },
        modelId: 'modelId',
        applicationProfile: true,
        resources: [
          {
            identifier: 'attr-1',
            label: {
              fi: 'attr-1-fi',
            },
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'attr-2',
            label: {
              fi: 'attr-2-fi',
            },
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'attr-3',
            label: {
              fi: 'attr-3-fi',
            },
            type: 'ATTRIBUTE',
          },
          {
            identifier: 'assoc-1',
            label: {
              fi: 'assoc-1-fi',
            },
            type: 'ASSOCIATION',
            referenceType: 'ASSOCIATION',
          },
          {
            identifier: 'assoc-2',
            label: {
              fi: 'assoc-2-fi',
            },
            type: 'ASSOCIATION',
            referenceType: 'ASSOCIATION',
          },
          {
            identifier: 'assoc-3',
            label: {
              fi: 'assoc-3-fi',
            },
            type: 'ASSOCIATION',
            referenceType: 'ASSOCIATION',
          },
        ],
      },
      type: 'classNode',
    });
  });
});
