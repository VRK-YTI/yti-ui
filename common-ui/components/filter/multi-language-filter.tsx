import useUrlState, {
  initialUrlState,
} from '../../utils/hooks/use-url-state';
import { useTranslation } from 'next-i18next';
import { MultiSelect } from 'suomifi-ui-components';
import { DropdownWrapper } from './filter.styles';

export default function MultiLanguageFilter() {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();

  const languages = [
    {
      labelText: t('vocabulary-info-fi'),
      uniqueItemId: 'fi',
    },
    {
      labelText: t('vocabulary-info-en'),
      uniqueItemId: 'en',
    },
    {
      labelText: t('vocabulary-info-sv'),
      uniqueItemId: 'sv',
    },
  ];

  const currLangs = languages
    .filter((lang) => lang.uniqueItemId === urlState.lang)
    .filter((lang) => lang);

  return (
    <DropdownWrapper>
      <MultiSelect
        ariaOptionChipRemovedText=""
        ariaOptionsAvailableText={t('languages-available')}
        ariaSelectedAmountText=""
        items={languages}
        labelText={t('filter-by-language')}
        noItemsText={t('no-languages-available')}
        visualPlaceholder={t('choose-language')}
        chipListVisible
        defaultSelectedItems={currLangs}
        onItemSelectionsChange={(lang) => {
          patchUrlState({
            lang: lang ? lang.map((l) => l.uniqueItemId)[0] : '',
            page: initialUrlState.page,
          });
        }}
      />
    </DropdownWrapper>
  );
}
