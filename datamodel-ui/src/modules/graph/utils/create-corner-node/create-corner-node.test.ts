import createCornerNode, { createNewCornerNode } from '.';

describe('create-corner-node', () => {
  it('should create a corner node', () => {
    const returned = createCornerNode({
      identifier: 'corner-1',
      position: {
        x: 100,
        y: 250,
      },
      referenceTarget: 'target-1',
    });

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

  it('should create a new corner node', () => {
    const returned = createNewCornerNode('corner-1', { x: 0, y: 100 });

    expect(returned).toStrictEqual({
      id: '#corner-1',
      data: {},
      position: {
        x: 0,
        y: 100,
      },
      type: 'cornerNode',
    });
  });
});
