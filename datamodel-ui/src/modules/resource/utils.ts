import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { compareLocales } from '@app/common/utils/compare-locals';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  return {
    ...data,
    classType: data.classType ? data.classType.uri : undefined,
    codeLists: data.codeLists
      ? data.codeLists.map((codeList) => ({
          id: codeList,
          prefLabel: {
            [Object.keys(data.label).sort((a, b) => compareLocales(a, b))[0]]:
              codeList,
          },
          status: 'DRAFT',
        }))
      : [],
    dataType: data.dataType
      ? { id: data.dataType, label: data.dataType }
      : undefined,
    domain: data.domain
      ? {
          id: data.domain.uri,
          label: data.domain.curie,
        }
      : undefined,
    equivalentResource: data.equivalentResource
      ? data.equivalentResource.map((er) => ({
          label: er.curie,
          uri: er.uri,
        }))
      : [],
    path: data.path
      ? {
          id: data.path.uri,
          label: data.path.curie,
          uri: data.path.uri,
        }
      : undefined,
    range: data.range
      ? {
          id: data.range.uri,
          label:
            data.type == ResourceType.ASSOCIATION
              ? data.range.curie
              : data.range.uri,
        }
      : undefined,
    subResourceOf:
      data.subResourceOf && data.subResourceOf.length > 0
        ? data.subResourceOf.map((sro) => {
            if (
              sro.uri.endsWith('/owl#topDataProperty') ||
              sro.uri.endsWith('/owl#topObjectProperty') ||
              sro.uri.endsWith('/owl#TopObjectProperty')
            ) {
              return {
                label: sro.curie,
                uri: sro.curie,
              };
            }

            return {
              label: sro.curie,
              uri: sro.uri,
            };
          })
        : [],
  };
}
