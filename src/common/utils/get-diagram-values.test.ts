import getDiagramValues from './get-diagram-values';

describe('get-diagram-values', () => {
  it('should generate values from valid input', () => {
    const input =
      '"{"name":"diagram name","url":"https://www.suomi.fi","description":"diagram description"}"';
    const gotten = getDiagramValues(input);
    const expected = {
      name: 'diagram name',
      url: 'https://www.suomi.fi',
      description: 'diagram description',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should generate empty values from empty input', () => {
    const input = '';
    const gotten = getDiagramValues(input);
    const expected = {
      name: '',
      url: '',
      description: '',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should generate empty values from incorrect input', () => {
    const input = 'this is an invalid input';
    const gotten = getDiagramValues(input);
    const expected = {
      name: '',
      url: '',
      description: '',
    };

    expect(gotten).toStrictEqual(expected);
  });
});
