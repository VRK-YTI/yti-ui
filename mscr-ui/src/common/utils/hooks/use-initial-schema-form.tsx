import { Schema, SchemaFormType } from '@app/common/interfaces/schema.interface';
import { useTranslation } from 'next-i18next';
import { Format } from '@app/common/interfaces/format.interface';
import { State } from '@app/common/interfaces/state.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useRouter } from 'next/router';

// Here we need initial schema form data defined in SchemaFormType
export function useInitialSchemaForm(initialData?: Schema): SchemaFormType {
  const { t } = useTranslation('admin');
  const lang = useRouter().locale ?? '';

  if (initialData) {
    return {
      format: initialData.format,
      languages: [
        {
          labelText: t('language-english-with-suffix'),
          uniqueItemId: 'en',
          title: initialData.label['en'] ?? getLanguageVersion({
            data: initialData.label,
            lang: lang,
          }),
          description: initialData.description['en'] ?? getLanguageVersion({
            data: initialData.description,
            lang: lang,
          }),
          selected: true,
        },
      ],
      organizations: initialData.organizations,
      state: State.Draft,
    };
  }

  return {
    format: Format.Csv,
    languages: [
      // Hiding Finnish and Swedish for now
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
    organizations: [],
    state: State.Draft,
  };
}
