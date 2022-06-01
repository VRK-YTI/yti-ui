import useUrlState, { initialUrlState } from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';
import { SingleSelect } from 'suomifi-ui-components';
import { DropdownWrapper } from './filter.styles';

export default function LanguageFilter() {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();

  const languages = [
    {
      labelText: t('vocabulary-info-fi'),
      uniqueItemId: 'fi'
    },
    {
      labelText: t('vocabulary-info-en'),
      uniqueItemId: 'en'
    },
    {
      labelText: t('vocabulary-info-sv'),
      uniqueItemId: 'sv'
    }
  ];

  const currLang = languages.find(
    (lang) => lang.uniqueItemId === urlState.lang
  );

  return (
    <DropdownWrapper>
      <SingleSelect
        ariaOptionsAvailableText='Kieliä saatavilla'
        clearButtonLabel='Tyhjennä kielivalinta'
        items={languages}
        labelText='Rajaa kielen mukaan'
        noItemsText='Ei kieliä saatavilla'
        selectedItem={currLang}
        onItemSelect={lang => patchUrlState({
          lang: lang ?? undefined,
          page: initialUrlState.page,
        })}
      />
    </DropdownWrapper>
  );
}
