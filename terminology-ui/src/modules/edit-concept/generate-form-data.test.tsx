import {
  emptyFormExpected,
  emptyFormReturned,
  //extensiveDataExpected,
  //extensiveDataReturned,
  initialDataExpected,
  initialDataReturned,
} from './generate-form-data-test-variables';

describe('generate-form-data', () => {
  it('should generate empty form', () => {
    expect(emptyFormReturned).toStrictEqual(emptyFormExpected);
  });

  it('should generate simple data with existing data', () => {
    expect(initialDataReturned).toStrictEqual(initialDataExpected);
  });
});
