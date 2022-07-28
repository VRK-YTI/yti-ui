import generateCollection from '.';

describe('generate-collection', () => {
  it('should generate collection without concepts', () => {
    const data = {
      name: [
        {
          lang: 'fi',
          value: 'uusi käsitevalikoima',
        },
        {
          lang: 'en',
          value: 'new collection',
        },
      ],
      definition: [
        {
          lang: 'fi',
          value: 'kuvaus',
        },
        {
          lang: 'en',
          value: 'description',
        },
      ],
      concepts: [],
    };

    const now = new Date();

    const returned = generateCollection(data, 'terminologyId', 'collectionId');
    returned[0].createdDate = now.toISOString();
    returned[0].lastModifiedDate = now.toISOString();

    expect(returned).toStrictEqual([
      {
        createdBy: '',
        createdDate: now.toISOString(),
        id: 'collectionId',
        lastModifiedBy: '',
        lastModifiedDate: now.toISOString(),
        properties: {
          definition: [
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'kuvaus',
            },
            {
              lang: 'en',
              regex: '(?s)^.*$',
              value: 'description',
            },
          ],
          prefLabel: [
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'uusi käsitevalikoima',
            },
            {
              lang: 'en',
              regex: '(?s)^.*$',
              value: 'new collection',
            },
          ],
        },
        references: {
          broader: [],
          member: [],
        },
        referrers: {},
        type: {
          graph: {
            id: 'terminologyId',
          },
          id: 'Collection',
          uri: 'http://www.w3.org/2004/02/skos/core#Collection',
        },
      },
    ]);
  });

  it('should generate collection with concepts', () => {
    const data = {
      name: [
        {
          lang: 'fi',
          value: 'uusi käsitevalikoima',
        },
      ],
      definition: [],
      concepts: [
        {
          id: '123-123123-123',
          prefLabels: {
            fi: 'fi',
            en: 'en',
          },
        },
        {
          id: '456-456456-456',
          prefLabels: {
            fi: 'fi',
            en: 'en',
          },
        },
        {
          id: '789-789789-789',
          prefLabels: {
            fi: 'fi',
            en: 'en',
          },
        },
      ],
    };

    const returned = generateCollection(data, 'terminologyId');

    const collectionId = returned[0].id;

    const now = new Date();
    returned[0].createdDate = now.toISOString();
    returned[0].lastModifiedDate = now.toISOString();

    expect(returned).toStrictEqual([
      {
        createdBy: '',
        createdDate: now.toISOString(),
        id: collectionId,
        lastModifiedBy: '',
        lastModifiedDate: now.toISOString(),
        properties: {
          definition: [],
          prefLabel: [
            {
              lang: 'fi',
              regex: '(?s)^.*$',
              value: 'uusi käsitevalikoima',
            },
          ],
        },
        references: {
          broader: [],
          member: [
            {
              id: '123-123123-123',
              type: {
                graph: {
                  id: 'terminologyId',
                },
                id: 'Concept',
                uri: '',
              },
            },
            {
              id: '456-456456-456',
              type: {
                graph: {
                  id: 'terminologyId',
                },
                id: 'Concept',
                uri: '',
              },
            },
            {
              id: '789-789789-789',
              type: {
                graph: {
                  id: 'terminologyId',
                },
                id: 'Concept',
                uri: '',
              },
            },
          ],
        },
        referrers: {},
        type: {
          graph: {
            id: 'terminologyId',
          },
          id: 'Collection',
          uri: 'http://www.w3.org/2004/02/skos/core#Collection',
        },
      },
    ]);
  });
});
