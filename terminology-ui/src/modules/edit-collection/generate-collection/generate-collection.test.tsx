import generateCollection from '.';

describe('generate-collection', () => {
  it('should generate new collection with concepts', () => {
    const data = {
      identifier: 'collection-1',
      label: {
        fi: 'uusi käsitekokoelma',
        en: 'new collection',
      },
      description: {
        fi: 'kuvaus',
        en: 'description',
      },
      members: [
        {
          uri: 'https://iri.suomi.fi/terminology/test/concept-1',
          identifier: 'concept-1',
          label: {},
        },
        {
          uri: 'https://iri.suomi.fi/terminology/test/concept-2',
          identifier: 'concept-2',
          label: {},
        },
      ],
    };

    const returned = generateCollection(data, false);

    expect(returned).toStrictEqual({
      description: {
        en: 'description',
        fi: 'kuvaus',
      },
      identifier: 'collection-1',
      label: {
        en: 'new collection',
        fi: 'uusi käsitekokoelma',
      },
      members: ['concept-1', 'concept-2'],
    });
  });
});
