import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Collection } from '@app/common/interfaces/collection.interface';
import {
  VocabularyConceptDTO,
  VocabularyConcepts,
} from '@app/common/interfaces/vocabulary.interface';
import { UrlState } from './hooks/use-url-state';

export default function filterData(
  data: VocabularyConcepts | Collection[],
  urlState: UrlState,
  language: string
) {
  if ('concepts' in data) {
    const filteredData = data.concepts.filter(
      (concept: VocabularyConceptDTO) => {
        let valid = false;

        if (
          !urlState.q ||
          concept.definition?.[language]
            ?.toLowerCase()
            .includes(urlState.q.toLowerCase()) ||
          concept.label?.[language]
            ?.toLowerCase()
            .includes(urlState.q.toLowerCase()) ||
          concept.label?.[Object.keys(concept.label)[0]]
            .toLowerCase()
            .includes(urlState.q.toLowerCase())
        ) {
          valid = true;
        }

        if (valid && urlState.status.includes(concept.status?.toLowerCase())) {
          valid = true;
        } else {
          valid = false;
        }

        if (valid) {
          return concept;
        }
      }
    );

    return { ...data, concepts: filteredData };
  } else if (Array.isArray(data)) {
    const filteredData: Collection[] = [];

    data.forEach((collection) => {
      const prefLabel = getPropertyValue({
        property: collection.properties.prefLabel,
        language,
      });

      if (prefLabel?.includes(urlState.q.toLowerCase())) {
        filteredData.push(collection);
      }
    });

    return filteredData;
  }
}
