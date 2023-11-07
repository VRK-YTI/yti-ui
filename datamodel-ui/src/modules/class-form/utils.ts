import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';

// TODO: Need to add equivalentClass, subClassOf and subject after backend is ready
// TODO this does not really work since we need to get data from backend that cannot be gotten from the form
export function classFormToClass(data: ClassFormType): ClassType {
  return {
    editorialNote: data.editorialNote,
    equivalentClass: [],
    identifier: data.identifier,
    label: data.label,
    note: data.note,
    status: data.status,
    subClassOf: [],
    subject: data.concept,
    contact: '',
    created: '',
    creator: {
      id: '',
      name: '',
    },
    modified: '',
    modifier: {
      id: '',
      name: '',
    },
    contributor: [
      {
        id: '',
        label: {},
        parentOrganization: '',
      },
    ],
    uri: '',
    curie: '',
  };
}

export interface ClassFormErrors {
  identifier: boolean;
  identifierInitChar: boolean;
  identifierLength: boolean;
  identifierCharacters: boolean;
  label: boolean;
  unauthorized?: boolean;
}

export function validateClassForm(data: ClassFormType): ClassFormErrors {
  const returnErrors: ClassFormErrors = {
    identifier: true,
    identifierInitChar: true,
    identifierLength: true,
    identifierCharacters: true,
    label: true,
  };

  if (
    Object.values(data.label).filter((value) => value.trim().length > 0)
      .length > 0
  ) {
    returnErrors.label = false;
  }

  if (data.identifier.trim() !== '') {
    returnErrors.identifier = false;
  } else {
    return {
      ...returnErrors,
      identifierInitChar: false,
      identifierLength: false,
      identifierCharacters: false,
    };
  }

  if (data.identifier.length > 1 && data.identifier.length < 33) {
    returnErrors.identifierLength = false;
  }

  if (/^[^0-9]/.test(data.identifier) || data.identifier.trim() === '') {
    returnErrors.identifierInitChar = false;
  }

  if (data.identifier.match(/^[a-zA-Z0-9\-_]+$/)) {
    returnErrors.identifierCharacters = false;
  }

  return returnErrors;
}
