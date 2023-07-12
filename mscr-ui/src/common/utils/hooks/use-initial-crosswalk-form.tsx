import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import { useTranslation } from 'next-i18next';

// Here we need initial crosswalk form data defined in CrosswalkFormType
export function useInitialCrosswalkForm(): CrosswalkFormType {
  const { t } = useTranslation('admin');

  return {
    pid: '',
    format: '',
    label: '',
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
    sourceSchema: '',
    targetSchema: '',
  };
}
