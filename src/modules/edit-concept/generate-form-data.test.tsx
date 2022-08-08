import {
  emptyFormExpected,
  emptyFormReturned,
  extensiveDataExpected,
  extensiveDataReturned,
  simpleDataExpected,
  simpleDataReturned,
} from './generate-form-data-test-variables';

describe('generate-form-data', () => {
  it('should generate empty form', () => {
    expect(emptyFormReturned).toStrictEqual(emptyFormExpected);
  });

  it('should generate simple data with existing data', () => {
    expect(simpleDataReturned).toStrictEqual(simpleDataExpected);
  });

  it('should generate extensive form with existing data', () => {
    expect(extensiveDataReturned).toStrictEqual(extensiveDataExpected);
  });
});
