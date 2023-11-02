import { ModelFormType } from '@app/common/interfaces/model-form.interface';

export function useInitialModelForm(): ModelFormType {
  return {
    contact: '',
    languages: [],
    organizations: [],
    prefix: '',
    serviceCategories: [],
    type: 'profile' as ModelFormType['type'],
    status: 'DRAFT',
    terminologies: [],
    externalNamespaces: [],
    internalNamespaces: [],
    codeLists: [],
    links: [],
  };
}
