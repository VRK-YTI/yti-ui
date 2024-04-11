import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { ClassType } from '@app/common/interfaces/class.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';

export const OWL_THING = {
  uri: 'http://www.w3.org/2002/07/owl#Thing',
  label: { en: 'Thing' },
  curie: 'owl:Thing',
};

export function internalClassToClassForm(
  data: InternalClass,
  applicationProfile?: boolean,
  targetIsAppProfile?: boolean,
  associations?: SimpleResource[],
  attributes?: SimpleResource[]
): ClassFormType {
  const obj = {
    editorialNote: '',
    equivalentClass: [],
    identifier: applicationProfile ? data.identifier : '',
    uri: data.id,
    label: {},
    inheritedAttributes: [],
    note: {},
    subClassOf: [],
    ownAttributes: [],
    status: 'DRAFT',
    apiPath: '',
  } as ClassFormType;

  if (applicationProfile) {
    if (targetIsAppProfile) {
      obj['node'] = {
        uri: data.id,
        curie: data.curie,
        label: data.label,
      };
    } else {
      obj['targetClass'] = {
        uri: data.id,
        curie: data.curie,
        label: data.label,
      };
    }

    obj['association'] = associations ?? [];
    obj['attribute'] = attributes ?? [];
  } else {
    obj['subClassOf'] = [
      {
        label: data.label,
        uri: data.id,
        curie: data.curie,
      },
    ];
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
    uri: data.uri,
    label: data.label,
    note: data.note,
    association: data.association,
    attribute: data.attribute,
    ...(applicationProfile
      ? {
          //Application profile specific properties
          targetClass: data.targetClass,
          node: data.targetNode,
          apiPath: data.apiPath,
        }
      : {
          //Library specific properties
          equivalentClass: data.equivalentClass,
          disjointWith: data.disjointWith,
          subClassOf:
            data.subClassOf &&
            data.subClassOf.filter(
              (soc) => soc.uri !== 'http://www.w3.org/2002/07/owl#Thing'
            ).length > 0
              ? data.subClassOf
              : [OWL_THING],
        }),
  };
}
