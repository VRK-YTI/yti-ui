import convertToEdges from '.';
import {
  dottedEdgeExpected,
  solidEdgeExpected,
  visualizationHiddenTypeArray,
  visualizationTypeArray,
  withHiddenEdgeExpected,
} from './convert-to-edges.test.data';

describe('convert-to-edges', () => {
  it('should return an empty array if no associations defined', () => {
    const returned = convertToEdges([], []);

    expect(returned).toStrictEqual([]);
  });

  it('should return solid edges', () => {
    const returned = convertToEdges(visualizationTypeArray(), []);

    expect(returned).toHaveLength(2);
    expect(returned).toStrictEqual(solidEdgeExpected);
  });

  it('should return dotted edges', () => {
    const returned = convertToEdges(visualizationTypeArray(), [], true);

    expect(returned).toHaveLength(2);
    expect(returned).toStrictEqual(dottedEdgeExpected);
  });

  it('should return edges with corners', () => {
    const returned = convertToEdges(
      visualizationTypeArray(true),
      visualizationHiddenTypeArray
    );

    expect(returned).toStrictEqual(withHiddenEdgeExpected);
  });
});
