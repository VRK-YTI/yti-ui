import { Concept, getConceptMock } from './concept.interface';
import { BaseEntity, Property } from './termed-data-types.interface';

export interface Collection extends BaseEntity<'Collection'> {
  properties: {
    definition?: Property[];
    prefLabel?: Property[];
  };

  references: {
    member?: Concept[];
    broader?: Concept[];
  };
}

export function getCollectionMock(
  collectionName: string,
  memberNames?: Property[]
): Collection {
  return {
    code: 'collection-1000',
    createdBy: 'Admin User',
    createdDate: '1970-01-01T00:00:00.000+00:00',
    id: '0001',
    identifier: {
      id: '123-123',
      type: {
        id: 'Collection',
        graph: {
          id: '123-123',
        },
        uri: '',
      },
    },
    lastModifiedBy: 'Admin User',
    lastModifiedDate: '1970-01-01T00:00:00.000+00:00',
    number: 1,
    properties: {
      prefLabel: [
        {
          lang: 'fi',
          regex: '',
          value: collectionName ?? 'Collection-01',
        },
      ],
    },
    references: {
      member: memberNames
        ? memberNames.map((label) => getConceptMock(label))
        : [],
    },
    referrers: {},
    type: {
      id: 'Collection',
      graph: {
        id: '123-123',
      },
      uri: '',
    },
    uri: '',
  };
}
