import createAssociationEdge from '.';

describe('create-association-edge', () => {
  it('should create a solid association edge', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createAssociationEdge(
      {
        fi: 'Association label fi',
        en: 'Association label en',
      },
      deleteMock,
      splitMock,
      'id-1',
      {}
    );

    const expected = {
      type: 'solidEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#222',
      },
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
        label: {
          fi: 'Association label fi',
          en: 'Association label en',
        },
      },
    };

    expect(input).toStrictEqual(expected);
  });

  it('should create a dotted association edge', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createAssociationEdge(
      {
        fi: 'Association label fi',
        en: 'Association label en',
      },
      deleteMock,
      splitMock,
      'id-1',
      {},
      true
    );

    const expected = {
      type: 'dottedEdge',
      markerEnd: 'clearArrow',
      style: {
        stroke: '#235A9A',
        strokeDasharray: '4 2',
      },
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
        label: {
          fi: 'Association label fi',
          en: 'Association label en',
        },
      },
    };

    expect(input).toStrictEqual(expected);
  });

  it('should create an association edge with params', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createAssociationEdge(
      {
        fi: 'Association label fi',
        en: 'Association label en',
      },
      deleteMock,
      splitMock,
      'id-1',
      {
        param1: 'basic string',
        param2: {
          label: 'object with values of different type',
          number: 1,
          list: ['list-item-1', 'list-item-2'],
        },
      }
    );

    const expected = {
      type: 'solidEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#222',
      },
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
        label: {
          fi: 'Association label fi',
          en: 'Association label en',
        },
      },
      param1: 'basic string',
      param2: {
        label: 'object with values of different type',
        number: 1,
        list: ['list-item-1', 'list-item-2'],
      },
    };

    expect(input).toStrictEqual(expected);
  });

  it('should create a dotted association edge with an offset value', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createAssociationEdge(
      {
        fi: 'Association label fi',
        en: 'Association label en',
      },
      deleteMock,
      splitMock,
      'id-1',
      {},
      true,
      2
    );

    const expected = {
      type: 'dottedEdge',
      markerEnd: 'clearArrow',
      style: {
        stroke: '#235A9A',
        strokeDasharray: '4 2',
      },
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
        label: {
          fi: 'Association label fi',
          en: 'Association label en',
        },
        offsetSource: 2,
      },
    };

    expect(input).toStrictEqual(expected);
  });
});
