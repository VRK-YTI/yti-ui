import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { NewClass } from '@app/common/interfaces/new-class.interface';

export function internalClassToClassForm(data: InternalClass): ClassFormType {
  const label = Object.keys(data.label).reduce(
    (acc, key) => ({ ...acc, [key]: '' }),
    {}
  );

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
export function classFormToNewClass(data: ClassFormType): NewClass {
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

export function validateClassForm(data: ClassFormType): boolean {
  return false;
}
