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
    subject: 'http://uri.suomi.fi/terminology/demo',
    contact: '',
    created: '',
    modified: '',
    contributor: [
      {
        id: '',
        label: {},
        parentOrganization: '',
      },
    ],
    uri: '',
  };
}

export interface ClassFormErrors {
  identifier: boolean;
  label: boolean;
  unauthorized?: boolean;
}

export function validateClassForm(data: ClassFormType): ClassFormErrors {
  const returnErrors: ClassFormErrors = {
    identifier: true,
    label: true,
  };

  if (
    Object.values(data.label).filter((value) => value || value !== '').length >
    0
  ) {
    returnErrors.label = false;
  }

  if (data.identifier && data.identifier !== '') {
    returnErrors.identifier = false;
  }

  return returnErrors;
}
