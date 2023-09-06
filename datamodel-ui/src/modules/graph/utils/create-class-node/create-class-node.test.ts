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
        parentClasses: [],
        position: {
          x: 0,
          y: 0,
        },
        attributes: [],
        associations: [],
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
        label: {
          fi: 'label-1-fi',
        },
        parentClasses: [],
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
          },
          {
            identifier: 'assoc-2',
            label: {
              fi: 'assoc-2-fi',
            },
          },
          {
            identifier: 'assoc-3',
            label: {
              fi: 'assoc-3-fi',
            },
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
          },
          {
            identifier: 'assoc-2',
            label: {
              fi: 'assoc-2-fi',
            },
            type: 'ASSOCIATION',
          },
          {
            identifier: 'assoc-3',
            label: {
              fi: 'assoc-3-fi',
            },
            type: 'ASSOCIATION',
          },
        ],
      },
      type: 'classNode',
    });
  });
});
