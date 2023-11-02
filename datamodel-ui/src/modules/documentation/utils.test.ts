import {
  getCurrentRowNumber,
  getAddNewLine,
  injectSpecialCharacters,
} from './utils';

describe('documentation utils', () => {
  it('should give the right row number', () => {
    const data = 'test\ndemo\nmockdata';
    const position1 = 5;
    const position2 = 10;
    const currentRowNumber = getCurrentRowNumber(data, position1);
    const currentRowNumber2 = getCurrentRowNumber(data, position2);

    expect(currentRowNumber).toBe(2);
    expect(currentRowNumber2).toBe(3);
  });

  it('should return true only if the row is empty', () => {
    const data = '**first row**\n\n1. first item\n2. second item\n\nfooter';
    const emptyPos1 = 15;
    const emptyPos2 = 44;

    const addNewLine1 = getAddNewLine(data, emptyPos1);
    const addNewLine2 = getAddNewLine(data, emptyPos2);

    expect(addNewLine1).toBeTruthy();
    expect(addNewLine2).toBeTruthy();

    const notEmptyPos1 = 0;
    const notEmptyPos2 = 30;
    const notEmptyPos3 = 50;

    const addNewLine3 = getAddNewLine(data, notEmptyPos1);
    const addNewLine4 = getAddNewLine(data, notEmptyPos2);
    const addNewLine5 = getAddNewLine(data, notEmptyPos3);

    expect(addNewLine3).toBeFalsy();
    expect(addNewLine4).toBeFalsy();
    expect(addNewLine5).toBeFalsy();
  });

  it('should inject special characters into correct spots', () => {
    const data = 'this is a row of text';
    const selection = {
      start: 10,
      end: 13,
    };
    const elem: [string, string] = ['**', '**'];
    const expected = 'this is a **row** of text';
    const result = injectSpecialCharacters(data, selection, elem);
    expect(result).toStrictEqual(expected);
  });
});
