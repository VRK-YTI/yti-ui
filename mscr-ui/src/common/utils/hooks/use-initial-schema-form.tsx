import { SchemaFormType } from '@app/common/interfaces/schema.interface';
import { useTranslation } from 'next-i18next';

// Here we need initial schema form data defined in SchemaFormType
export function useInitialSchemaForm(): SchemaFormType {
  const { t } = useTranslation('admin');

  return {
    format:'',
    label:'',
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
  };
}
