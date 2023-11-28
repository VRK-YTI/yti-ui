import convertToEdges from '.';
import {
  expectedLibraryEdges,
  expectedProfileEdges,
  libraryData,
  profileData,
} from '../visualization-test-data';

describe('convert-to-edges', () => {
  it('should return an empty array if no associations or parent class references defined', () => {
    const returned = convertToEdges([], [], (key: string) => key, 'modelId');

    expect(returned).toStrictEqual([]);
  });

  it('should return edges for library', () => {
    const returned = convertToEdges(
      libraryData.nodes,
      libraryData.hiddenNodes,
      (key: string) => key,
      'modelId'
    );
    expect(returned).toStrictEqual(expectedLibraryEdges);
  });

  it('should return edges for application profile', () => {
    const returned = convertToEdges(
      profileData.nodes,
      profileData.hiddenNodes,
      (key: string) => key,
      'modelId',
      true
    );
    expect(returned).toStrictEqual(expectedProfileEdges);
  });
});
