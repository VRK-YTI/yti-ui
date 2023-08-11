import convertToNodes from '.';
import {
  convertedExpected,
  convertedWithHiddenExpected,
  visualizationTypeArray,
  visualizationHiddenTypeArray,
} from './convert-to-nodes.test.data';

describe('convert-to-nodes', () => {
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
});
