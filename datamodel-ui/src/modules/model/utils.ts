import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { ClassType } from '@app/common/interfaces/class.interface';

export function internalClassToClassForm(
  data: InternalClass,
  languages: string[]
): ClassFormType {
  const label = languages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {});

  return {
    comment: '',
    concept: {},
    equivalentClass: [],
    identifier: '',
    label: label,
    inheritedAttributes: [],
    note: {},
    ownAttributes: [],
    subClassOf: [
      {
        label:
          data.id.split('/').pop()?.replace('#', ':') ??
          `${data.isDefinedBy.split('/').pop()}:${data.identifier}`,
        identifier: `${data.isDefinedBy}/${data.identifier}`,
        attributes: ['Attribuutti #1', 'Attribuutti #2'],
      },
    ],
    status: 'DRAFT',
  };
}

// TODO: Need to add equivalentClass, subClassOf and subject after backend is ready
export function classFormToClass(data: ClassFormType): ClassType {
  return {
    comment: data.comment,
    equivalentClass: [],
    identifier: data.identifier,
    label: data.label,
    note: data.note,
    status: data.status,
    subClassOf: [],
    subject: 'http://uri.suomi.fi/terminology/demo',
  };
}

export interface ClassFormErrors {
  identifier: boolean;
  label: boolean;
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
