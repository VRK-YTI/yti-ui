import { Organization } from '../interfaces/organization.interface';
import { Term } from '../interfaces/term.interface';
import { getProperty } from './get-property';

describe('getProperty', () => {
  it('should work with Term', () => {
    const items: Term[] = [{ properties: {} }] as Term[];

    expect(getProperty('prefLabel', items)).toStrictEqual([]);
  });

  it('should work with Organization', () => {
    const items: Organization[] = [{ properties: {} }] as Organization[];

    expect(getProperty('prefLabel', items)).toStrictEqual([]);
  });

  it('should return correct property', () => {
    const items: Term[] = [
      {
        properties: {
          prefLabel: [{ value: 'A' }],
          changeNote: [{ value: 'B' }],
        },
      },
    ] as Term[];

    expect(getProperty('prefLabel', items)).toStrictEqual([{ value: 'A' }]);
  });

  it('should merge properties of multiple items', () => {
    const items: Term[] = [
      {
        properties: {
          prefLabel: [{ value: 'A' }],
        },
      },
      {
        properties: {
          prefLabel: [{ value: 'B' }],
        },
      },
    ] as Term[];

    expect(getProperty('prefLabel', items)).toStrictEqual([
      { value: 'A' },
      { value: 'B' },
    ]);
  });
});
