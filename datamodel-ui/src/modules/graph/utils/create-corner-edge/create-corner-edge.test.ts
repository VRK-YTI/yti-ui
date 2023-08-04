import createCornerEdge from '.';

describe('create-corner-edge', () => {
  it('should create a corner edge', () => {
    const returned = createCornerEdge('source-1', 'target-1', {
      just: 'some data',
      number: 1,
    });

    expect(returned).toStrictEqual({
      id: 'reactflow__edge-source-1-#corner-target-1',
      source: 'source-1',
      sourceHandle: 'source-1',
      target: 'target-1',
      targetHandle: 'target-1',
      type: 'defaultEdge',
      data: {
        just: 'some data',
        number: 1,
      },
    });
  });
});
