import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import { useTranslation } from 'next-i18next';
import { SingleSelect, SingleSelectData } from 'suomifi-ui-components';
import { DropdownWrapper } from './filter.styles';

interface LanguageFilterProps {
  labelText: string;
  languages?: SingleSelectData[];
}

export default function LanguageFilter({
  labelText,
  languages = [],
}: LanguageFilterProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();

  return (
    <DropdownWrapper>
      <SingleSelect
        ariaOptionsAvailableText={t('languages-available') as string}
        clearButtonLabel={t('clear-language-filter')}
        items={languages}
        labelText={labelText}
        visualPlaceholder={t('choose-language')}
        itemAdditionHelpText={''}
        defaultSelectedItem={languages.find(
          (lang) => lang.uniqueItemId === urlState.lang
        )}
        onItemSelect={(lang) =>
          patchUrlState({
            lang: lang ? lang : '',
            page: initialUrlState.page,
          })
        }
        id="filter-language-selector"
      />
    </DropdownWrapper>
  );
}
