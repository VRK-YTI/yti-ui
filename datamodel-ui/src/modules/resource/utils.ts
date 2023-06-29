import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  return {
    ...data,
    domain: data.domain
      ? {
          id: data.domain,
          label: data.domain.split('/').pop()?.replace('#', ':') ?? data.domain,
        }
      : undefined,
    equivalentResource: [],
    range: data.range
      ? {
          id: data.range,
          label:
            data.type == ResourceType.ASSOCIATION
              ? data.range.split('/').pop()?.replace('#', ':') ?? data.range
              : data.range,
        }
      : undefined,
    subResourceOf:
      data.subResourceOf && data.subResourceOf.length > 0
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
  };
}
