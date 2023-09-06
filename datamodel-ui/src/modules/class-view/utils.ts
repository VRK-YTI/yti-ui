import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';

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

export function classTypeToClassForm(
  data: ClassType,
  applicationProfile: boolean
): ClassFormType {
  return {
    concept: data.subject,
    editorialNote: data.editorialNote ?? '',
    identifier: data.identifier,
    label: data.label,
    note: data.note,
    status: data.status,
    association: data.association,
    attribute: data.attribute,
    ...(applicationProfile
      ? {
          //Application profile specific properties
          targetClass: data.targetClass
            ? {
                id: data.targetClass.uri,
                label: data.targetClass.curie,
              }
            : undefined,
          node: data.targetNode
            ? {
                id: data.targetNode.uri,
                label: data.targetNode.curie,
              }
            : undefined,
        }
      : {
          //Library specific properties
          equivalentClass:
            data.equivalentClass?.map((ec) => ({
              identifier: ec.uri,
              label: ec.curie,
            })) ?? undefined,
          disjointWith:
            data.disjointWith?.map((dw) => ({
              id: dw.uri,
              label: dw.curie,
            })) ?? undefined,
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
        }),
  };
}
