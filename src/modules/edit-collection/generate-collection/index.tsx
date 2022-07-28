import { v4 } from 'uuid';
import { EditCollectionFormDataType } from '../edit-collection.types';

export default function generateCollection(
  formData: EditCollectionFormDataType,
  terminologyId: string,
  collectionId?: string
) {
  const regex = '(?s)^.*$';
  const now = new Date();

  return [
    {
      createdBy: '',
      createdDate: now.toISOString(),
      id: collectionId ? collectionId : v4(),
      lastModifiedBy: '',
      lastModifiedDate: now.toISOString(),
      properties: {
        definition:
          formData.definition.length > 0
            ? formData.definition
                .filter((d) => d.value !== '')
                .map((d) => ({
                  lang: d.lang,
                  regex: regex,
                  value: d.value,
                }))
            : [],
        prefLabel: formData.name
          .filter((n) => n.value !== '')
          .map((n) => ({
            lang: n.lang,
            regex: regex,
            value: n.value,
          })),
      },
      references: {
        broader: [],
        member: formData.concepts.map((c) => ({
          id: c.id,
          type: {
            graph: {
              id: terminologyId,
            },
            id: 'Concept',
            uri: '',
          },
        })),
      },
      referrers: {},
      type: {
        graph: {
          id: terminologyId,
        },
        id: 'Collection',
        uri: 'http://www.w3.org/2004/02/skos/core#Collection',
      },
    },
  ];
}
