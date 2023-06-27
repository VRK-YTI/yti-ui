import {
  convertToNodes,
  createNewAssociationEdge,
  createNewCornerEdge,
  generateInitialEdges,
  getConnectedCornerIds,
  handleEdgeDelete,
} from './utils';
import {
  connectedEdgesRemoved,
  connectedEdgesRemovedMultiple,
  convertedExpected,
  convertedLangVersionedExpected,
  initialEdges,
  threeEdgesOneMultipleSplit,
  twoEdgesOneSplit,
  visualizationTypeArray,
} from './util.test.data';
import { MarkerType } from 'reactflow';

describe('graph-util', () => {
  it('should return an empty array if given an empty array', () => {
    const returned = convertToNodes([]);

    expect(returned).toStrictEqual([]);
  });

  it('should convert VisualizationType[] to a Node[]', () => {
    const input = visualizationTypeArray;

    const expected = convertedExpected;
    const expectedLangVersioned = convertedLangVersionedExpected;

    const returned = convertToNodes(input);
    expect(returned).toStrictEqual(expected);

    const returnedLangVersioned = convertToNodes(input, 'en');
    expect(returnedLangVersioned).toStrictEqual(expectedLangVersioned);
  });

  it('should return an empty array if input data is an empty array', () => {
    const input = getConnectedCornerIds([], '1');

    expect(input).toStrictEqual([]);
  });

  it('should return an empty array if source is missing', () => {
    const input = getConnectedCornerIds(twoEdgesOneSplit);

    expect(input).toStrictEqual([]);
  });

  it('should get all connected edge ids between two class node', () => {
    const input1 = getConnectedCornerIds(twoEdgesOneSplit, 'corner-12312312');
    const input2 = getConnectedCornerIds(
      threeEdgesOneMultipleSplit,
      'corner-4'
    );

    expect(input1).toHaveLength(2);
    expect(input1).toStrictEqual(connectedEdgesRemoved);

    expect(input2).toHaveLength(5);
    expect(input2).toStrictEqual(connectedEdgesRemovedMultiple);
  });

  it('should create a association edge', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createNewAssociationEdge(
      'association',
      deleteMock,
      splitMock,
      {}
    );

    const expected = {
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 30,
        width: 30,
      },
      label: 'association',
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
      },
    };

    expect(input).toStrictEqual(expected);
  });

  it('should create a association edge with params', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createNewAssociationEdge(
      'association',
      deleteMock,
      splitMock,
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
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 30,
        width: 30,
      },
      label: 'association',
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
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

  it('should create a new corner edge', () => {
    const input = createNewCornerEdge('source', 'target', {});

    const expected = {
      id: 'reactflow__edge-source-#corner-target',
      source: 'source',
      sourceHandle: 'source',
      target: 'target',
      targetHandle: 'target',
      type: 'defaultEdge',
      data: {},
    };

    expect(input).toStrictEqual(expected);
  });

  it('should remove an edge between two class nodes', () => {
    const input = handleEdgeDelete('reactflow__edge-class-1-class-2', [
      {
        source: 'class-1',
        sourceHandle: 'class-1',
        target: 'class-2',
        targetHandle: 'class-2',
        type: 'associationEdge',
        markerEnd: {
          type: 'arrowclosed' as MarkerType,
          height: 30,
          width: 30,
        },
        label: 'Association',
        data: {},
        id: 'reactflow__edge-class-1-class-2',
      },
    ]);

    expect(input).toStrictEqual([]);
  });

  it('should remove a corner', () => {
    const input = handleEdgeDelete('reactflow__edge-class-1-#corner-#corner', [
      {
        source: 'class-1',
        sourceHandle: 'class-1',
        target: '#corner',
        targetHandle: '#corner',
        type: 'defaultEdge',
        data: {},
        id: 'reactflow__edge-class-1-#corner-#corner',
      },
      {
        source: '#corner',
        sourceHandle: '#corner',
        target: 'class-2',
        targetHandle: 'class-2',
        type: 'associationEdge',
        markerEnd: {
          type: 'arrowclosed' as MarkerType,
          height: 30,
          width: 30,
        },
        label: 'Association',
        data: {},
        id: 'reactflow__edge-#corner-#corner-class-2',
      },
    ]);

    expect(input).toStrictEqual([
      {
        source: 'class-1',
        sourceHandle: 'class-1',
        target: 'class-2',
        targetHandle: 'class-2',
        type: 'associationEdge',
        markerEnd: {
          type: 'arrowclosed' as MarkerType,
          height: 30,
          width: 30,
        },
        label: 'Association',
        data: {},
        id: 'reactflow__edge-class-1-class-2',
      },
    ]);
  });

  it('should generate association edges', () => {
    const mockDelete = jest.fn();
    const mockSplit = jest.fn();

    const input = generateInitialEdges(
      visualizationTypeArray,
      mockDelete,
      mockSplit,
      'fi'
    );

    const expected = initialEdges(mockDelete, mockSplit);

    expect(input).toStrictEqual(expected);
  });
});
