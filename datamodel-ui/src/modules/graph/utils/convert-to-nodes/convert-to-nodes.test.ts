import convertToNodes from '.';
import {
  expectedLibraryNodes,
  expectedProfilesNodes,
  libraryData,
  profileData,
} from '../visualization-test-data';

describe('convert-to-nodes', () => {
  it('should return an empty array if given an empty array', () => {
    const handleNodeDeleteMock = jest.fn();

    const returned = convertToNodes([], [], 'modelId', handleNodeDeleteMock);

    expect(returned).toStrictEqual([]);
  });

  it('should return nodes for library', () => {
    const handleNodeDeleteMock = jest.fn();

    const returned = convertToNodes(
      libraryData.nodes,
      libraryData.hiddenNodes,
      'visu',
      handleNodeDeleteMock
    );
    const expected = expectedLibraryNodes(handleNodeDeleteMock);
    expect(returned).toStrictEqual(expected);
  });

  it('should return nodes for application profile', () => {
    const handleNodeDeleteMock = jest.fn();

    const returned = convertToNodes(
      profileData.nodes,
      profileData.hiddenNodes,
      'visuprof',
      handleNodeDeleteMock,
      true
    );
    const expected = expectedProfilesNodes(handleNodeDeleteMock);
    expect(returned).toStrictEqual(expected);
  });
});
