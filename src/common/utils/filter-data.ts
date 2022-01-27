import { getPropertyValue } from '../components/property-value/get-property-value';
import { Collection } from '../interfaces/collection.interface';
import { VocabularyConcepts } from '../interfaces/vocabulary.interface';

export default function filterData(
  data: VocabularyConcepts | Collection[],
  filter: any,
  keyword: string,
  language: string,
  page?: any,
  pagination: boolean = false
) {
  if ('concepts' in data) {
    const filteredData = data.concepts.filter((concept: any) => {
      let valid = false;

      if (!keyword ||
        concept.definition?.[language]?.toLowerCase().includes(keyword.toLowerCase()) ||
        concept.label?.[language]?.toLowerCase().includes(keyword.toLowerCase()) ||
        concept.label?.[Object.keys(concept.label)[0]].toLowerCase().includes(keyword.toLowerCase()))
      {
        valid = true;
      }


      if (valid && filter.status[concept.status] === true) {
        valid = true;
      } else {
        valid = false;
      }

      if (valid) { return concept; }
    });

    return {...data, concepts: filteredData};

  } else if (Array.isArray(data)) {
    let filteredData: Collection[] = [];

    if (!page && !pagination) {
      page = 1;
    }

    data.forEach(collection => {
      if (getPropertyValue({ property: collection.properties.prefLabel, language: language })
        ?.includes(keyword.toLowerCase()))
      {
        filteredData.push(collection);
      }
    });

    if (pagination) {
      filteredData.filter((collection, idx) => {
        if ((idx < parseInt(page) * 10) && (idx >= (parseInt(page) * 10) - 10)) {
          return collection;
        }
      });
    }

    return filteredData;
  }
}
