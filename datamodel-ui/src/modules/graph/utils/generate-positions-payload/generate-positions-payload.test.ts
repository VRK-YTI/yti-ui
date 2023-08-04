import generatePositionsPayload from '.';

describe('generate-positions-payload', () => {
  it('should return an empty array if no positions are provided', () => {
    const returned = generatePositionsPayload([], []);

    expect(returned).toStrictEqual([]);
  });

  it('should generate a payload for positions', () => {
    const returned = generatePositionsPayload(
      [
        {
          id: 'node-1',
          data: {},
          position: {
            x: 0,
            y: 0,
          },
        },
        {
          id: 'node-2',
          data: {},
          position: {
            x: 50,
            y: 0,
          },
        },
        {
          id: 'node-3',
          data: {},
          position: {
            x: 50,
            y: 50,
          },
        },
        {
          id: '#corner-1',
          data: {},
          position: {
            x: 25,
            y: 25,
          },
        },
      ],
      [
        {
          id: 'edge-1-corner-1',
          source: 'node-1',
          target: '#corner-1',
        },
        {
          id: 'edge-corner-1-2',
          source: '#corner-1',
          target: 'node-2',
        },
      ]
    );

    expect(returned).toStrictEqual([
      {
        identifier: 'node-1',
        referenceTargets: ['corner-1'],
        x: 0,
        y: 0,
      },
      {
        identifier: 'node-2',
        referenceTargets: [],
        x: 50,
        y: 0,
      },
      {
        identifier: 'node-3',
        referenceTargets: [],
        x: 50,
        y: 50,
      },
      {
        identifier: 'corner-1',
        referenceTargets: ['node-2'],
        x: 25,
        y: 25,
      },
    ]);
  });
});
