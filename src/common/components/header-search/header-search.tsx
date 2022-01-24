import React, { useEffect, useState } from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import IconButton from '../icon-button/icon-button';
import { useBreakpoints } from '../media-query/media-query-context';
import { CloseButton } from './header-search.styles';
import { useRouter } from 'next/router';
import useQueryParam from '../../utils/hooks/useQueryParam';

export interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderSearch({ isSearchOpen, setIsSearchOpen }: HeaderSearchProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const isSearchPage = router.route === '/search';

  const [keyword] = useQueryParam('q');
  const [searchInputValue, setSearchInputValue] = useState<string>(isSearchPage ? (keyword ?? '') : '');
  useEffect(() => {
    if (isSearchPage) {
      setSearchInputValue(keyword ?? '');
    }
  }, [keyword, setSearchInputValue, isSearchPage]);

  if (isSmall && !isSearchOpen) {
    return (
      <IconButton
        icon="search"
        aria-label={t('terminology-search-open')}
        onClick={() => setIsSearchOpen(true)}
      />
    );
  }
  return (
    <>
      <SearchInput
        clearButtonLabel=""
        labelText=""
        value={searchInputValue ?? ''}
        labelMode="hidden"
        searchButtonLabel={t('terminology-search')}
        visualPlaceholder={t('terminology-search-placeholder')}
        wrapperProps={{ style: { 'flexGrow': isSmall ? 1 : 0 } }}
        onSearch={value => {
          if (typeof value === 'string') search(value);
        }}
        onChange={value => {
          setSearchInputValue(String(value ?? ''));
          if (value === '') search();
        }}
      />
      {isSmall ? (
        <CloseButton
          onClick={() => setIsSearchOpen(false)}
          variant="secondaryNoBorder"
        >
          {t('close')}
        </CloseButton>
      ) : null}
    </>
  );

  function search(q?: string) {
    const previousSearchParameters = isSearchPage ? router.query : {};

    const queryParameters = { ...previousSearchParameters };
    if (q) {
      queryParameters.q = q;
    } else {
      delete queryParameters.q;
    }

    return router.push({
      pathname: '/search',
      query: queryParameters,
    }, undefined, { shallow: true });
  }
}
