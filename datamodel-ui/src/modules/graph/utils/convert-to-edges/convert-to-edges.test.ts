import convertToEdges from '.';
import {
  dottedEdgeExpected,
  hiddenEdgeExpected,
  solidEdgeExpected,
  visualizationHiddenTypeArray,
  visualizationTypeArray,
} from './convert-to-edges.test.data';

describe('convert-to-edges', () => {
  it('should return an empty array if no associations defined', () => {
    const handleDeleteMock = jest.fn();
    const splitEdgeMock = jest.fn();

    const returned = convertToEdges([], [], handleDeleteMock, splitEdgeMock);

    expect(returned).toStrictEqual([]);
  });

  it('should return solid edges', () => {
    const handleDeleteMock = jest.fn();
    const splitEdgeMock = jest.fn();

    const returned = convertToEdges(
      visualizationTypeArray,
      [],
      handleDeleteMock,
      splitEdgeMock
    );

    expect(returned).toHaveLength(2);
    expect(returned).toStrictEqual(
      solidEdgeExpected(handleDeleteMock, splitEdgeMock)
    );
  });

  it('should return dotted edges', () => {
    const handleDeleteMock = jest.fn();
    const splitEdgeMock = jest.fn();

    const returned = convertToEdges(
      visualizationTypeArray,
      [],
      handleDeleteMock,
      splitEdgeMock,
      true
    );

    expect(returned).toHaveLength(2);
    expect(returned).toStrictEqual(
      dottedEdgeExpected(handleDeleteMock, splitEdgeMock)
    );
  });

  it('should return edges with corners', () => {
    const handleDeleteMock = jest.fn();
    const splitEdgeMock = jest.fn();

    const returned = convertToEdges(
      visualizationTypeArray,
      visualizationHiddenTypeArray,
      handleDeleteMock,
      splitEdgeMock
    );

    const expected = [
      ...solidEdgeExpected(handleDeleteMock, splitEdgeMock),
      ...hiddenEdgeExpected(handleDeleteMock, splitEdgeMock),
    ];

    expect(returned).toStrictEqual(expected);
  });
});
