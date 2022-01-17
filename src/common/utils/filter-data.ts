import { VocabularyConcepts } from '../interfaces/vocabulary.interface';

export default function filterData(data: VocabularyConcepts, filter: any, keyword: string, language: any) {
  let filteredData;

  filteredData = data.concepts.filter((concept: any) => {
    let valid = false;

    if (!keyword ||
      concept.definition?.[language].toLowerCase().includes(keyword.toLowerCase()) ||
      concept.label?.[language].toLowerCase().includes(keyword.toLowerCase()))
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
