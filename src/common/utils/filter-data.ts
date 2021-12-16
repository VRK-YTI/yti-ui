import { VocabularyConcepts } from '../interfaces/vocabulary.interface';

export default function filterData(data: VocabularyConcepts, filter: any, language: any) {
  let filteredData;

  filteredData = data.concepts.filter((concept: any) => {
    let valid = false;

    if (filter.keyword === '' ||
      concept.definition[language].toLowerCase().includes(filter.keyword.toLowerCase()) ||
      concept.label[language].toLowerCase().includes(filter.keyword.toLowerCase()))
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
}
