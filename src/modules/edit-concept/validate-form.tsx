import { EditConceptType } from './new-concept.types';

export interface FormError {
  termPrefLabel: boolean;
  recommendedTerms: boolean;
  termEditorialNote: boolean;
  example: boolean;
  note: boolean;
  editorialNote: boolean;
  total: boolean;
}

export default function validateForm(data: EditConceptType): FormError {
  const errors = {
    termPrefLabel: false,
    recommendedTerms: false,
    termEditorialNote: false,
    example: false,
    note: false,
    editorialNote: false,
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
    errors.termEditorialNote = true;
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

  // Setting total of errors if one error is found in object
  for (const key of Object.keys(errors).filter((k) => k !== 'total')) {
    if (errors[key as keyof typeof errors]) {
      errors.total = true;
      break;
    }
  }

  return errors;
}
