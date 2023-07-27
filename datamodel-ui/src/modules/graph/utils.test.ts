import {
  convertToNodes,
  createNewAssociationEdge,
  createNewCornerEdge,
  generateInitialEdges,
  generatePositionsPayload,
  getConnectedCornerIds,
  handleEdgeDelete,
} from './utils';
import {
  connectedEdgesRemoved,
  connectedEdgesRemovedMultiple,
  convertedExpected,
  convertedWithHiddenExpected,
  initialEdges,
  initialEdgesWithHidden,
  multipleFromOneCornerEdges,
  multipleFromOneCornerNodes,
  noCornerEdges,
  noCornerNodes,
  oneCornerEdges,
  oneCornerNodes,
  threeEdgesOneMultipleSplit,
  twoCornerEdges,
  twoCornerNodes,
  twoEdgesOneSplit,
  visualizationHiddenTypeArray,
  visualizationTypeArray,
  visualizationTypeArrayWithHidden,
} from './util.test.data';
import { MarkerType } from 'reactflow';

describe('graph-util', () => {
  it('should return an empty array if given an empty array', () => {
    const returned = convertToNodes([], []);

    expect(returned).toStrictEqual([]);
  });

  it('should convert VisualizationType[] to a Node[]', () => {
    const input = visualizationTypeArray;

    const expected = convertedExpected;

    const returned = convertToNodes(input, []);
    expect(returned).toStrictEqual(expected);
  });

  it('should convert VisualizationType[] and VisualizationHiddenNode[] to a Node[]', () => {
    const input = visualizationTypeArray;
    const inputHidden = visualizationHiddenTypeArray;

    const expected = convertedWithHiddenExpected;

    const returned = convertToNodes(input, inputHidden);
    expect(returned).toStrictEqual(expected);
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

  it('should create an association edge', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createNewAssociationEdge(
      'association',
      deleteMock,
      splitMock,
      'id-1',
      {}
    );

    const expected = {
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#222',
      },
      label: 'association',
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
      },
    };

    expect(input).toStrictEqual(expected);
  });

  it('should create an association edge with params', () => {
    const deleteMock = jest.fn();
    const splitMock = jest.fn();

    const input = createNewAssociationEdge(
      'association',
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
      type: 'associationEdge',
      markerEnd: {
        type: 'arrowclosed',
        height: 20,
        width: 20,
        color: '#222',
      },
      label: 'association',
      data: {
        handleDelete: deleteMock,
        splitEdge: splitMock,
        identifier: 'id-1',
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
      [],
      mockDelete,
      mockSplit,
      'fi'
    );

    const expected = initialEdges(mockDelete, mockSplit);

    expect(input).toStrictEqual(expected);
  });

  it('should generate edges between classes and corners', () => {
    const mockDelete = jest.fn();
    const mockSplit = jest.fn();

    const input = generateInitialEdges(
      visualizationTypeArrayWithHidden,
      visualizationHiddenTypeArray,
      mockDelete,
      mockSplit,
      'fi'
    );

    const expected = initialEdgesWithHidden(mockDelete, mockSplit);

    expect(input).toStrictEqual(expected);
  });

  it('should generate payload that has no corner nodes', () => {
    const input = generatePositionsPayload(noCornerNodes, noCornerEdges);

    expect(input).toStrictEqual([
      {
        identifier: 'class-1',
        x: 0,
        y: 0,
        referenceTargets: [],
      },
      {
        identifier: 'class-2',
        x: 0,
        y: 100,
        referenceTargets: [],
      },
    ]);
  });

  it('should generate payload that has corner node', () => {
    const input = generatePositionsPayload(oneCornerNodes, oneCornerEdges);

    expect(input).toStrictEqual([
      {
        identifier: 'class-1',
        x: 0,
        y: 0,
        referenceTargets: ['corner-12345678'],
      },
      {
        identifier: 'class-2',
        x: 0,
        y: 100,
        referenceTargets: [],
      },
      {
        identifier: 'corner-12345678',
        x: 5,
        y: 50,
        referenceTargets: ['class-2'],
      },
    ]);
  });

  it('should generate payload that has corner nodes', () => {
    const input = generatePositionsPayload(twoCornerNodes, twoCornerEdges);

    expect(input).toStrictEqual([
      {
        identifier: 'class-1',
        x: 0,
        y: 0,
        referenceTargets: ['corner-12345678'],
      },
      {
        identifier: 'class-2',
        x: 0,
        y: 100,
        referenceTargets: [],
      },
      {
        identifier: 'corner-12345678',
        x: 5,
        y: 50,
        referenceTargets: ['corner-87654321'],
      },
      {
        identifier: 'corner-87654321',
        x: 15,
        y: 50,
        referenceTargets: ['class-2'],
      },
    ]);
  });

  it('should generate payload where one class that has multiple corner nodes connected', () => {
    const input = generatePositionsPayload(
      multipleFromOneCornerNodes,
      multipleFromOneCornerEdges
    );

    expect(input).toStrictEqual([
      {
        identifier: 'class-1',
        x: 0,
        y: 0,
        referenceTargets: ['corner-12345678', 'corner-87654321'],
      },
      {
        identifier: 'class-2',
        x: 0,
        y: 100,
        referenceTargets: [],
      },
      {
        identifier: 'class-3',
        x: 100,
        y: 100,
        referenceTargets: [],
      },
      {
        identifier: 'corner-12345678',
        x: 5,
        y: 50,
        referenceTargets: ['class-2'],
      },
      {
        identifier: 'corner-87654321',
        x: 50,
        y: 50,
        referenceTargets: ['class-3'],
      },
    ]);
  });
});
