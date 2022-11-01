import { EditConceptType } from './new-concept.types';

export interface FormError {
  termPrefLabel: boolean;
  recommendedTerms: boolean;
  example: boolean;
  note: boolean;
  editorialNote: boolean;
  source: boolean;
  status: boolean;
  diagrams: boolean;
  diagramsUri: boolean;
  termConjugation: boolean;
  total: boolean;
}

// This is meant to be used with unit tests
export const EmptyFormError = {
  termPrefLabel: false,
  recommendedTerms: false,
  example: false,
  note: false,
  editorialNote: false,
  source: false,
  status: false,
  diagrams: false,
  diagramsUri: false,
  termConjugation: false,
  total: false,
};

export default function validateForm(data: EditConceptType): FormError {
  const errors = {
    termPrefLabel: false,
    recommendedTerms: false,
    example: false,
    note: false,
    editorialNote: false,
    source: false,
    status: false,
    diagrams: false,
    diagramsUri: false,
    termConjugation: false,
    total: false,
  };

  // If any term has a name that is empty or undefined
  if (
    data.terms.filter((term) => !term.prefLabel || term.prefLabel === '')
      .length > 0
  ) {
    errors.termPrefLabel = true;
  }

  // If there are no recommended terms defined
  if (
    data.terms.filter((term) => term.termType === 'recommended-term').length < 1
  ) {
    errors.recommendedTerms = true;
  }

  // If there are editorial notes with empty values in terms
  if (
    data.terms.filter(
      (term) =>
        term.editorialNote.length > 0 &&
        term.editorialNote.filter((note) => !note.value || note.value === '')
          .length > 0
    ).length > 0
  ) {
    errors.editorialNote = true;
  }

  // If there are examples with empty values
  if (
    data.basicInformation.example.length > 0 &&
    data.basicInformation.example.filter((e) => !e.value || e.value === '')
      .length > 0
  ) {
    errors.example = true;
  }

  // If there are notes with empty values
  if (
    data.basicInformation.note.length > 0 &&
    data.basicInformation.note.filter((n) => !n.value || n.value === '')
      .length > 0
  ) {
    errors.note = true;
  }

  // If there are editoral notes with empty values
  if (
    data.basicInformation.orgInfo.editorialNote.length > 0 &&
    data.basicInformation.orgInfo.editorialNote.filter(
      (note) => !note.value || note.value === ''
    ).length > 0
  ) {
    errors.editorialNote = true;
  }

  // If there are sources with empty values
  if (
    data.basicInformation.diagramAndSource.sources.length > 0 &&
    data.basicInformation.diagramAndSource.sources.filter(
      (source) => !source.value || source.value === ''
    ).length > 0
  ) {
    errors.source = true;
  }

  // If there are diagrams with empty values
  if (
    data.basicInformation.diagramAndSource.diagrams.length > 0 &&
    data.basicInformation.diagramAndSource.diagrams.filter(
      (diagram) =>
        !diagram.name ||
        diagram.name === '' ||
        !diagram.url ||
        diagram.url === ''
    ).length > 0
  ) {
    errors.diagrams = true;
  }

  // If there urls in diagrams that are incorrect (e.g. currently don't have any full stops (.))
  if (
    !errors.diagrams &&
    data.basicInformation.diagramAndSource.diagrams.filter(
      (diagram) => !diagram.url.includes('.')
    ).length > 0
  ) {
    errors.diagramsUri = true;
  }

  // If the status is undefined
  if (
    data.basicInformation.status === '' ||
    data.basicInformation.status.length < 1 ||
    !data.basicInformation.status
  ) {
    errors.status = true;
  }

  // If any terms conjugation is not one of the available
  // Currently available conjugations are 'singular' and 'plural'
  if (
    data.terms
      .map((t) => t.termConjugation)
      .filter((c) => c && !['singular', 'plural'].includes(c)).length > 0
  ) {
    errors.termConjugation = true;
  }

  // Setting total of errors if one error is found in object
  for (const key of Object.keys(errors).filter((k) => k !== 'total')) {
    if (errors[key as keyof typeof errors]) {
      errors.total = true;
      break;
    }
  }

  return errors;
}
