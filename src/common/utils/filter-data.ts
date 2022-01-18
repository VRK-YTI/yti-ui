import { getPropertyValue } from '../components/property-value/get-property-value';
import { Collection } from '../interfaces/collection.interface';
import { VocabularyConcepts } from '../interfaces/vocabulary.interface';

export default function filterData(data: VocabularyConcepts | Collection[], filter: any, language: any) {

  if ('concepts' in data) {
    const filteredData = data.concepts.filter((concept: any) => {
      let valid = false;

      if (filter.keyword === '' ||
        concept.definition?.[language]?.toLowerCase().includes(filter.keyword.toLowerCase()) ||
        concept.label[language]?.toLowerCase().includes(filter.keyword.toLowerCase()) ||
        concept.label[Object.keys(concept.label)[0]].toLowerCase().includes(filter.keyword.toLowerCase()))
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

    data.forEach(collection => {
      console.log(collection);
      if (getPropertyValue({ property: collection.properties.prefLabel, language: language })?.includes(filter.keyword.toLowerCase())) {
        filteredData.push(collection);
      } else if (collection.properties.prefLabel?.[0].value.includes(filter.keyword.toLowerCase())) {
        filteredData.push(collection);
      }
    });

    return filteredData;
  }
}
