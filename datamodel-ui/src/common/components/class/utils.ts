import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { OWL_THING } from '@app/modules/class-view/utils';

export function convertToPayload(
  data: ClassFormType,
  isEdit: boolean,
  applicationProfile?: boolean,
  basedOnNodeShape?: boolean
): object {
  const { concept, ...retVal } = data;
  const conceptURI = concept?.conceptURI;

  const ret = {
    ...retVal,
    //Library only properties
    ...(!applicationProfile && {
      equivalentClass: data.equivalentClass?.map((eq) => eq.uri) ?? [],
      subClassOf: data.subClassOf
        ? data.subClassOf
            .filter((soc) => soc.uri !== OWL_THING.uri)
            .map((sco) => sco.uri)
        : [],
      disjointWith: data.disjointWith?.map((disjoint) => disjoint.uri) ?? [],
    }),

    subject: conceptURI,
    ...(basedOnNodeShape
      ? {
          targetNode: data.targetClass?.uri,
        }
      : {
          targetClass:
            data.targetClass?.uri === OWL_THING.uri
              ? undefined
              : data.targetClass?.uri,
          ...(data.node && {
            targetNode: data.node.uri,
          }),
        }),
    ...(applicationProfile &&
      !basedOnNodeShape && {
        properties: [
          ...(data.association?.map((a) => a.uri) ?? []),
          ...(data.attribute?.map((a) => a.uri) ?? []),
        ],
      }),
  };

  if (applicationProfile) {
    delete ret.association;
    delete ret.attribute;
  } else {
    delete ret.apiPath;
  }

  if (basedOnNodeShape) {
    delete ret.targetClass;
  }

  if (data.node) {
    delete ret.node;
  }

  return isEdit
    ? Object.fromEntries(
        Object.entries(ret).filter((e) => e[0] !== 'identifier')
      )
    : ret;
}
