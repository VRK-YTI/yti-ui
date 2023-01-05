import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { useTranslation } from 'next-i18next';
import { v4 } from 'uuid';

export function useInitialModelForm(): ModelFormType {
  const { t } = useTranslation('admin');
  const prefix = v4().substring(0, 8);

  return {
    contact: '',
    languages: [
      {
        labelText: t('language-finnish-with-suffix'),
        uniqueItemId: 'fi',
        title: '',
        description: '',
        selected: false,
      },
      {
        labelText: t('language-swedish-with-suffix'),
        uniqueItemId: 'sv',
        title: '',
        description: '',
        selected: false,
      },
      {
        labelText: t('language-english-with-suffix'),
        uniqueItemId: 'en',
        title: '',
        description: '',
        selected: false,
      },
    ],
    organizations: [],
    prefix: prefix,
    serviceCategories: [],
    type: 'profile' as ModelFormType['type'],
  };
}
