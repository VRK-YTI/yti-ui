import { ModelFormType } from '@app/common/interfaces/model-form.interface';

export function useInitialModelForm(): ModelFormType {
  return {
    contact: '',
    languages: [],
    organizations: [],
    prefix: '',
    serviceCategories: [],
    type: 'profile' as ModelFormType['type'],
    terminologies: [],
    externalNamespaces: [],
    internalNamespaces: [],
    codeLists: [],
    links: [],
  };
}
