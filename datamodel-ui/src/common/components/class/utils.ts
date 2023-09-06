import { ClassFormType } from '@app/common/interfaces/class-form.interface';

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
    equivalentClass: data.equivalentClass?.map((eq) => eq.identifier) ?? [],
    subClassOf: data.subClassOf
      ? data.subClassOf
          .filter((soc) => soc.identifier !== 'owl:Thing')
          .map((sco) => sco.identifier)
      : [],
    disjointWith: data.disjointWith?.map((disjoint) => disjoint.id) ?? [],
    subject: conceptURI,
    ...(basedOnNodeShape
      ? {
          targetNode: data.targetClass?.id,
        }
      : {
          targetClass: data.targetClass?.id,
          ...(data.node && {
            targetNode: data.node.id,
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
