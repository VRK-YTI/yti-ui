import createCornerNode from '.';

describe('create-corner-node', () => {
  it('should create a corner node', () => {
    const handleNodeDeleteMock = jest.fn();
    const returned = createCornerNode(
      {
        identifier: 'corner-1',
        position: {
          x: 100,
          y: 250,
        },
        referenceTarget: 'target-1',
      },
      handleNodeDeleteMock
    );

    expect(returned).toStrictEqual({
      id: '#corner-1',
      data: {},
      position: {
        x: 100,
        y: 250,
      },
      type: 'cornerNode',
    });
  });
});
