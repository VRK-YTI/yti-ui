import { Collection } from '@app/common/interfaces/collection.interface';
import { Concept } from '@app/common/interfaces/concept.interface';
import { Identifier } from '@app/common/interfaces/termed-data-types.interface';

export function generateConceptData(data: Concept) {
  const terminologyId = data.type.graph.id;
  const returnData: Identifier<string>[] = [];

  if (data.references.prefLabelXl) {
    returnData.push(
      ...data.references.prefLabelXl.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'Term',
          uri: '',
        },
      }))
    );
  }

  if (data.references.altLabelXl) {
    returnData.push(
      ...data.references.altLabelXl.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'Term',
          uri: '',
        },
      }))
    );
  }

  if (data.references.notRecommendedSynonym) {
    returnData.push(
      ...data.references.notRecommendedSynonym.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'Term',
          uri: '',
        },
      }))
    );
  }

  if (data.references.searchTerm) {
    returnData.push(
      ...data.references.searchTerm.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'Term',
          uri: '',
        },
      }))
    );
  }

  if (data.references.exactMatch) {
    returnData.push(
      ...data.references.exactMatch.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'ConceptLink',
          uri: '',
        },
      }))
    );
  }

  if (data.references.relatedMatch) {
    returnData.push(
      ...data.references.relatedMatch.map((label) => ({
        id: label.id,
        type: {
          graph: {
            id: terminologyId,
          },
          id: 'ConceptLink',
          uri: '',
        },
      }))
    );
  }

  returnData.push({
    id: data.id,
    type: {
      graph: {
        id: terminologyId,
      },
      id: 'Concept',
      uri: '',
    },
  });

  return returnData;
}

export function generateCollectionData(data: Collection) {
  const returnData = [];

  returnData.push({
    id: data.id,
    type: {
      graph: {
        id: data.type.graph.id,
      },
      id: 'Collection',
      uri: '',
    },
  });

  return returnData;
}
