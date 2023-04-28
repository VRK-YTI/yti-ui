import {
  ClassFormType,
  initialClassForm,
} from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';

export function internalClassToClassForm(
  data: InternalClass,
  languages: string[],
  applicationProfile?: boolean
): ClassFormType {
  const label = languages.reduce(
    (acc, lang) => ({ ...acc, [lang]: data.label[lang] }),
    {}
  );
  const obj = {
    editorialNote: '',
    equivalentClass: [],
    identifier: applicationProfile ? data.identifier : '',
    label: label,
    inheritedAttributes: [],
    note: {},
    subClassOf: [],
    ownAttributes: [],
    status: 'DRAFT',
  } as ClassFormType;

  if (applicationProfile) {
    obj['targetClass'] = {
      label:
        data.id.split('/').pop()?.replace('#', ':') ??
        `${data.isDefinedBy.split('/').pop()}:${data.identifier}`,
      id: data.id,
    };
  } else {
    obj['subClassOf'] = [
      {
        label:
          data.id.split('/').pop()?.replace('#', ':') ??
          `${data.isDefinedBy.split('/').pop()}:${data.identifier}`,
        identifier: `${data.isDefinedBy}/${data.identifier}`,
        attributes: ['Attribuutti #1', 'Attribuutti #2'],
      },
    ];
  }
  return obj;
}

export function classTypeToClassForm(data: ClassType): ClassFormType {
  return {
    concept: data.subject,
    editorialNote: data.editorialNote ?? '',
    equivalentClass: [],
    identifier: data.identifier,
    inheritedAttributes: [],
    label: data.label,
    note: data.note,
    ownAttributes: [],
    status: data.status,
    subClassOf: [],
  };
}
