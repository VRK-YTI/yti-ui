import { AssociationFormType } from '@app/common/interfaces/association-form.interface';
import { AttributeFormType } from '@app/common/interfaces/attribute-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

export function resourceToResourceFormType(
  data: Resource
): AssociationFormType | AttributeFormType {
  return {
    label: data.label,
    editorialNote: data.editorialNote,
    concept: data.subject,
    status: 'DRAFT',
    equivalentResource: [],
    subResourceOf:
      data.subResourceOf?.length > 0
        ? data.subResourceOf.map((sro) => {
            if (
              sro.endsWith('/owl#topDataProperty') ||
              sro.endsWith('/owl#topObjectProperty') ||
              sro.endsWith('/owl#TopObjectProperty')
            ) {
              return sro.split('/').pop()?.replace('#', ':') ?? sro;
            }

            return sro;
          })
        : [],
    identifier: data.identifier,
    note: data.note,
    type: data.type,
    domain: data.domain
      ? {
          id: data.domain,
          label: data.domain.split('/').pop()?.replace('#', ':') ?? data.domain,
        }
      : undefined,
    range: data.range
      ? {
          id: data.range,
          label:
            data.type == ResourceType.ASSOCIATION
              ? data.range.split('/').pop()?.replace('#', ':') ?? data.range
              : data.range,
        }
      : undefined,
  };
}
