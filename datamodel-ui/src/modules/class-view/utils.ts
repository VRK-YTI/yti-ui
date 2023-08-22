import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import { getCurie } from '@app/common/utils/get-value';

export function internalClassToClassForm(
  data: InternalClass,
  languages: string[],
  applicationProfile?: boolean,
  targetClass?: InternalClass,
  associations?: SimpleResource[],
  attributes?: SimpleResource[]
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
      label: data.curie,
      id: data.id,
    };
    obj['association'] = associations ?? [];
    obj['attribute'] = attributes ?? [];
  } else {
    obj['subClassOf'] = [
      {
        label: data.curie,
        identifier: data.id,
      },
    ];
  }

  if (targetClass) {
    obj['node'] = {
      label: data.curie,
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
        identifier: ec.uri,
        label: ec.curie,
      })) ?? [],
    identifier: data.identifier,
    label: data.label,
    note: data.note,
    status: data.status,
    subClassOf:
      data.subClassOf &&
      data.subClassOf.filter(
        (soc) => soc.uri !== 'http://www.w3.org/2002/07/owl#Thing'
      ).length > 0
        ? data.subClassOf?.map((sco) => ({
            identifier: sco.uri,
            label: sco.curie,
            attributes: [],
          }))
        : [
            {
              identifier: 'owl:Thing',
              label: 'owl:Thing',
            },
          ],
    association: data.association,
    attribute: data.attribute,
    targetClass: data.targetClass
      ? {
          id: data.targetClass.uri,
          label: data.targetClass.curie,
        }
      : undefined,
  };
}
