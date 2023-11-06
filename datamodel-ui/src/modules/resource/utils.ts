import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { v4 } from 'uuid';

export function resourceToResourceFormType(data: Resource): ResourceFormType {
  return {
    ...data,
    classType: data.classType,
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
    dataType: data.dataType,
    domain: data.domain,
    equivalentResource: data.equivalentResource,
    path: data.path,
    range: data.range,
    subResourceOf: data.subResourceOf,
  };
}
