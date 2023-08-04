import getEdgeParams from '.';

describe('get-edge-params', () => {
  it('should return default values if no source or target are provided', () => {
    const returned = getEdgeParams();

    expect(returned).toStrictEqual({
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0,
    });
  });

  it('should return the values for an edge between two class nodes', () => {
    const returned = getEdgeParams(
      {
        id: 'node-1',
        type: 'classNode',
        position: {
          x: 0,
          y: 0,
        },
        width: 50,
        height: 10,
        data: {},
      },
      {
        id: 'node-2',
        type: 'classNode',
        position: {
          x: 50,
          y: 50,
        },
        width: 50,
        height: 10,
        data: {},
      }
    );

    expect(returned).toStrictEqual({
      sx: 45,
      sy: 5,
      tx: 55,
      ty: 55,
    });
  });

  it('should return the values for an edge between two corner nodes', () => {
    const returned = getEdgeParams(
      {
        id: 'node-1',
        type: 'corner',
        position: {
          x: 0,
          y: 0,
        },
        width: 50,
        height: 10,
        data: {},
      },
      {
        id: 'node-2',
        type: 'corner',
        position: {
          x: 50,
          y: 50,
        },
        width: 50,
        height: 10,
        data: {},
      }
    );

    expect(returned).toStrictEqual({
      sx: 45,
      sy: 5,
      tx: 55,
      ty: 55,
    });
  });

  it('should return the values for an edge between a class node and a corner node', () => {
    const returned = getEdgeParams(
      {
        id: 'node-1',
        type: 'classNode',
        position: {
          x: 0,
          y: 0,
        },
        width: 50,
        height: 10,
        data: {},
      },
      {
        id: 'node-2',
        type: 'corner',
        position: {
          x: 50,
          y: 50,
        },
        width: 50,
        height: 10,
        data: {},
      }
    );

    expect(returned).toStrictEqual({
      sx: 45,
      sy: 5,
      tx: 55,
      ty: 55,
    });
  });
});
