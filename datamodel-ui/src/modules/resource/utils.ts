import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  return {
    ...data,
    dataType: data.dataType
      ? { id: data.dataType, label: data.dataType }
      : undefined,
    // TODO: Change to correct form after backend is updated
    dataTypeProperty: undefined,
    domain: data.domain
      ? {
          id: data.domain,
          label: data.domain.split('/').pop()?.replace('#', ':') ?? data.domain,
        }
      : undefined,
    equivalentResource: [],
    path: data.path
      ? {
          id: data.path,
          label:
            data.type == ResourceType.ASSOCIATION
              ? data.path.split('/').pop()?.replace('#', ':') ?? data.path
              : data.path,
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
