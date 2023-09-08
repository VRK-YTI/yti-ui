import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { v4 } from 'uuid';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  return {
    ...data,
    classType: data.classType ? data.classType.uri : undefined,
    concept: data.subject,
    allowedValues: data.allowedValues?.map((value) => {
      return {
        id: v4().split('-')[0],
        label: value,
      };
    }),
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
    domain: data.domain,
    equivalentResource: data.equivalentResource,
    path: data.path,
    range: data.range
      ? {
          uri: data.range.uri,
          curie: data.range.curie,
          label: {
            en:
              data.type == ResourceType.ASSOCIATION
                ? data.range.curie ?? ''
                : data.range.uri,
          },
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
                uri: sro.uri,
                curie: sro.curie,
                label: { en: sro.curie ? sro.curie?.replace('/owl#', '') : '' },
              };
            }
            return sro;
          })
        : [],
  };
}
