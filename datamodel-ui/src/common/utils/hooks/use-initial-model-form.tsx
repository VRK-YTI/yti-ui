import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { useTranslation } from 'next-i18next';
import { v4 } from 'uuid';

export function useInitialModelForm(): ModelFormType {
  const { t } = useTranslation('common');
  const prefix = v4().substring(0, 8);

  return {
    contact: '',
    languages: [
      {
        labelText: 'suomi FI',
        uniqueItemId: 'fi',
        title: '',
        description: '',
        selected: false,
      },
      {
        labelText: 'ruotsi SV',
        uniqueItemId: 'sv',
        title: '',
        description: '',
        selected: false,
      },
      {
        labelText: 'englanti EN',
        uniqueItemId: 'en',
        title: '',
        description: '',
        selected: false,
      },
    ],
    organizations: [],
    prefix: prefix,
    serviceCategories: [],
    type: 'profile',
  };
}
