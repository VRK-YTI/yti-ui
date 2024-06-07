import { useTranslation } from 'next-i18next';
import { Format } from '@app/common/interfaces/format.interface';
import { State } from '@app/common/interfaces/state.interface';
import { Type } from '@app/common/interfaces/search.interface';
import { LanguageBlockType } from 'yti-common-ui/components/form/language-selector';

export interface FormType {
  format: Format;
  state: State;
  languages: (LanguageBlockType & { selected: boolean })[];
  versionLabel: string;
  sourceSchema?: string;
  targetSchema?: string;
}

export function useInitialForm(type: Type): FormType {
  const { t } = useTranslation('admin');
  const initialForm : FormType = {
    format: type == Type.Crosswalk ? Format.Mscr : Format.Csv,
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
    versionLabel: '1',
  };
  if (type == Type.Crosswalk) {
    initialForm.sourceSchema = '';
    initialForm.targetSchema = '';
  }

  return initialForm;
}
