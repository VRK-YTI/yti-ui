import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  const pathLabel = data.path
    ? data.path
        .split('/')
        .map((p, idx) => {
          const length = data.path ? data.path.split('/').length : 0;
          if (idx === length - 1 || idx === length - 2) {
            return p;
          }

          return undefined;
        })
        .filter(Boolean)
        .join(':')
    : undefined;

  return {
    ...data,
    dataType: data.dataType
      ? { id: data.dataType, label: data.dataType }
      : undefined,
    domain: data.domain
      ? {
          id: data.domain,
          label: data.domain.split('/').pop()?.replace('#', ':') ?? data.domain,
        }
      : undefined,
    equivalentResource: [],
    path: data.path
      ? {
          id: pathLabel ?? data.path,
          label: pathLabel ?? data.path,
          uri: data.path,
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
