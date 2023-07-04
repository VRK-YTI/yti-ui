import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { Schema } from '@app/common/interfaces/schema.interface';
import { useTranslation } from 'next-i18next';

// Here we need initial schema form data defined according to schema interface
export function useInitialSchemaForm(): Schema {
  const { t } = useTranslation('admin');

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
    prefix: '',
    serviceCategories: [],
    type: 'profile' as ModelFormType['type'],
    terminologies: [],
  };
}
