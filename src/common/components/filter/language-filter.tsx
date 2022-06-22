import { Property } from '@app/common/interfaces/termed-data-types.interface';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { SingleSelect } from 'suomifi-ui-components';
import { DropdownWrapper } from './filter.styles';

interface LanguageFilterProps {
  labelText: string;
  languages?: { [key: string]: number } | Property[];
}

export default function LanguageFilter({
  labelText,
  languages,
}: LanguageFilterProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();
  const [availableLanguages] = useState(setAvailableLanguages());

  const currLang = availableLanguages.find(
    (lang) => lang.uniqueItemId === urlState.lang
  );

  return (
    <DropdownWrapper>
      <SingleSelect
        ariaOptionsAvailableText={t('languages-available')}
        clearButtonLabel={t('clear-language-filter')}
        items={availableLanguages}
        labelText={labelText}
        noItemsText={t('no-languages-available')}
        visualPlaceholder={t('choose-language')}
        selectedItem={currLang}
        onItemSelect={(lang) =>
          patchUrlState({
            lang: lang ? lang : '',
            page: initialUrlState.page,
          })
        }
      />
    </DropdownWrapper>
  );

  function setAvailableLanguages() {
    if (!languages) {
      return [];
    }

    if (Array.isArray(languages)) {
      return languages.map((l) => ({
        labelText: l.value,
        uniqueItemId: l.value,
      }));
    }

    return Object.keys(languages).map((l) => {
      return { labelText: l, uniqueItemId: l };
    });
  }
}
