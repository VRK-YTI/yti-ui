import {CrosswalkFormMockupType, CrosswalkFormType} from '@app/common/interfaces/crosswalk.interface';
import { useTranslation } from 'next-i18next';

// Here we need initial crosswalk form data defined in CrosswalkFormType
export function useInitialCrosswalkForm(): CrosswalkFormType {
  const { t } = useTranslation('admin');

  return {
    pid: '',
    format: '',
    label: '',
    state: '',
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
    organizations: [
      {
        uniqueItemId: '7d3a3c00-5a6b-489b-a3ed-63bb58c26a63',
        labelText: 'Interoperabilty Platform',
      },
    ],
    sourceSchema: '',
    targetSchema: '',
  };
}

export function useInitialCrosswalkFormMockup(): CrosswalkFormMockupType {
  const { t } = useTranslation('admin');

  return {
    format: '',
    state: '',
    pid: '',
    status: '',
    label: '',
    languages: ['en'],
    organizations: ['7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'],
    sourceSchema: '',
    targetSchema: '',
  };
}
