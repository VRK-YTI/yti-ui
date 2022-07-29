import { v4 } from 'uuid';
import {
  EditCollectionFormDataType,
  EditCollectionPostType,
  EditCollectionProps,
} from '../edit-collection.types';

export default function generateCollection(
  formData: EditCollectionFormDataType,
  terminologyId: string,
  lastModifiedBy?: string,
  collectionInfo?: EditCollectionProps['collectionInfo']
) {
  const regex = '(?s)^.*$';
  const now = new Date();

  const retVal: EditCollectionPostType = {
    createdBy: collectionInfo?.collectionId ? collectionInfo.createdBy : '',
    createdDate: now.toISOString(),
    id: collectionInfo?.collectionId ? collectionInfo.collectionId : v4(),
    lastModifiedBy: collectionInfo?.collectionId ? lastModifiedBy ?? '' : '',
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
      uri: collectionInfo?.collectionId
        ? ''
        : 'http://www.w3.org/2004/02/skos/core#Collection',
    },
  };

  if (collectionInfo?.collectionId) {
    retVal.code = collectionInfo.collectionCode;
    retVal.uri = collectionInfo.collectionUri;

    if (retVal.references.member[0]) {
      retVal.references.member[0].type.uri = '';
    }
  }

  return [retVal];
}
