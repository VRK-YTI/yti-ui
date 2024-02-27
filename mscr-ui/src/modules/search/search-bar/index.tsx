import { useTranslation } from 'next-i18next';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/use-url-state';
import { useContext, useEffect, useState } from 'react';
import {
  SEARCH_FIELD_PATTERN,
  TEXT_INPUT_MAX,
} from 'yti-common-ui/utils/constants';
import { SearchContext } from '@app/common/components/search-context-provider';
import { SearchInput } from 'suomifi-ui-components';

export default function SearchBar({ placeholder, hideLabel }: { placeholder?: string, hideLabel?: Boolean }) {
  const { t } = useTranslation('common');
  const { isSearchActive, setIsSearchActive } = useContext(SearchContext);
  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [searchInputValue, setSearchInputValue] = useState<string>(
    isSearchActive ? q : ''
  );
  const placeholderText = placeholder ?? t('search.bar.placeholder');

  const handleChange = (val: string) => {
    if (val.match(SEARCH_FIELD_PATTERN)) {
      setSearchInputValue(val ?? '');
    }
    if (val === '') {
      setIsSearchActive(false);
      search();
    }
  };

  useEffect(() => {
    if (isSearchActive) {
      setSearchInputValue(q);
    }
  }, [q, setSearchInputValue, isSearchActive]);

  return (
    <>
      <SearchInput
        labelText={t('search.bar.label')}
        clearButtonLabel={t('search.bar.clear-button')}
        searchButtonLabel={t('search.bar.search-button')}
        visualPlaceholder={placeholderText}
        value={searchInputValue ?? ''}
        onSearch={(value) => {
          if (typeof value === 'string') {
            setIsSearchActive(true);
            search(value);
          }
        }}
        onChange={(value) => handleChange(value?.toString() ?? '')}
        maxLength={TEXT_INPUT_MAX}
        labelMode={isSearchActive || hideLabel ? "hidden" : "visible"}
        fullWidth={!hideLabel}
      />
    </>
  );

  function search(q?: string) {
    if (q) {
      patchUrlState({
        q: q,
        page: initialUrlState.page,
      });
    } else {
      patchUrlState({
        q: initialUrlState.q,
        type: initialUrlState.type,
        state: initialUrlState.state,
        format: initialUrlState.format,
        organization: initialUrlState.organization,
        isReferenced: initialUrlState.isReferenced,
        page: initialUrlState.page,
      });
    }
  }
}
