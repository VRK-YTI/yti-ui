import {
  CrosswalkFormMockupType,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';
import { useTranslation } from 'next-i18next';
import { State } from '@app/common/interfaces/state.interface';
import { Format } from '@app/common/interfaces/format.interface';

// Here we need initial crosswalk form data defined in CrosswalkFormType
export function useInitialCrosswalkForm(): CrosswalkFormType {
  const { t } = useTranslation('admin');

  return {
    format: Format.Mscr,
    state: State.Draft,
    languages: [
      // Hiding Swedish and Finnish for now
      // {
      //   labelText: t('language-finnish-with-suffix'),
      //   uniqueItemId: 'fi',
      //   title: '',
      //   description: '',
      //   selected: false,
      // },
      // {
      //   labelText: t('language-swedish-with-suffix'),
      //   uniqueItemId: 'sv',
      //   title: '',
      //   description: '',
      //   selected: false,
      // },
      {
        labelText: t('language-english-with-suffix'),
        uniqueItemId: 'en',
        title: '',
        description: '',
        selected: true,
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
