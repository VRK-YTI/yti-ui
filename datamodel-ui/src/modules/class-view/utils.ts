import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';

export function internalClassToClassForm(
  data: InternalClass,
  languages: string[],
  applicationProfile?: boolean,
  targetClass?: InternalClass,
  associations?: {
    identifier: string;
    label: { [key: string]: string };
    modelId: string;
    uri: string;
  }[],
  attributes?: {
    identifier: string;
    label: { [key: string]: string };
    modelId: string;
    uri: string;
  }[]
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
      label: `${data.namespace.split('/').filter(Boolean).pop()}:${
        data.identifier
      }`,
      id: data.id,
    };
    obj['association'] = associations ?? [];
    obj['attribute'] = attributes ?? [];
  } else {
    obj['subClassOf'] = [
      {
        label: `${data.namespace.split('/').filter(Boolean).pop()}:${
          data.identifier
        }`,
        identifier: data.id,
        attributes: ['Attribuutti #1', 'Attribuutti #2'],
      },
    ];
  }

  if (targetClass) {
    obj['node'] = {
      label: `${targetClass.namespace
        .replace(/\/$/, '')
        .split('/')
        .pop()
        ?.replace('#', ':')}:${targetClass.identifier}`,
      id: targetClass.id,
    };
  }

  return obj;
}

export function classTypeToClassForm(data: ClassType): ClassFormType {
  return {
    concept: data.subject,
    editorialNote: data.editorialNote ?? '',
    equivalentClass:
      data.equivalentClass?.map((ec) => ({
        identifier: ec,
        label: ec,
      })) ?? [],
    identifier: data.identifier,
    label: data.label,
    note: data.note,
    status: data.status,
    subClassOf:
      data.subClassOf &&
      data.subClassOf.filter(
        (soc) => soc !== 'http://www.w3.org/2002/07/owl#Thing'
      ).length > 0
        ? data.subClassOf?.map((sco) => ({
            identifier: sco,
            label: sco,
            attributes: [],
          }))
        : [
            {
              identifier: 'owl:Thing',
              label: 'owl:Thing',
              attributes: [],
            },
          ],
    association: data.association,
    attribute: data.attribute,
    targetClass: data.targetClass
      ? {
          id: data.targetClass,
          label: data.targetClass,
        }
      : undefined,
  };
}
