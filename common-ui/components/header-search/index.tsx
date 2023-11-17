import React, { useEffect, useState } from 'react';
import { IconSearch, SearchInput } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import IconButton from '../icon-button';
import { useBreakpoints } from '../media-query';
import { CloseButton, SearchInputWrapper } from './header-search.styles';
import { useRouter } from 'next/router';
import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import { SEARCH_FIELD_PATTERN, TEXT_INPUT_MAX } from '../../utils/constants';

export interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderSearch({
  isSearchOpen,
  setIsSearchOpen,
}: HeaderSearchProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const isSearchPage = router.route === '/';

  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [searchInputValue, setSearchInputValue] = useState<string>(
    isSearchPage ? q : ''
  );

  const handleChange = (val: string) => {
    if (val.match(SEARCH_FIELD_PATTERN)) {
      setSearchInputValue(val ?? '');
    }
    if (val === '') search();
  };

  useEffect(() => {
    if (isSearchPage) {
      setSearchInputValue(q);
    }
  }, [q, setSearchInputValue, isSearchPage]);

  if (isSmall && !isSearchOpen) {
    return (
      <IconButton
        icon={<IconSearch />}
        aria-label={t('terminology-search-open')}
        onClick={() => setIsSearchOpen(true)}
      />
    );
  }
  return (
    <SearchInputWrapper>
      <SearchInput
        clearButtonLabel={t('terminology-search-clear')}
        labelText=""
        value={searchInputValue ?? ''}
        searchButtonLabel={t('terminology-search')}
        visualPlaceholder={t('terminology-search-placeholder')}
        style={{ flexGrow: isSmall ? 1 : 0 }}
        onSearch={(value) => {
          if (typeof value === 'string') search(value);
        }}
        onChange={(value) => handleChange(value?.toString() ?? '')}
        maxLength={TEXT_INPUT_MAX}
        id="top-header-search"
      />
      {isSmall ? (
        <CloseButton
          onClick={() => setIsSearchOpen(false)}
          variant="secondaryNoBorder"
        >
          {t('close')}
        </CloseButton>
      ) : (
        <></>
      )}
    </SearchInputWrapper>
  );

  function search(q?: string) {
    if (isSearchPage) {
      patchUrlState({
        q: q ?? '',
        page: initialUrlState.page,
      });
    } else {
      return router.push(
        {
          pathname: '/',
          query: q ? { q } : {},
        },
        undefined,
        { shallow: true }
      );
    }
  }
}
