import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectSearchTerm, setSearchTerm } from '../terminology-search/terminology-search-slice';
import { useStoreDispatch } from '../../../store';
import IconButton from '../icon-button/icon-button';
import { useBreakpoints } from '../media-query/media-query-context';
import { CloseButton } from './header-search.styles';

export interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderSearch({ isSearchOpen, setIsSearchOpen }: HeaderSearchProps) {
  const { t } = useTranslation('common');
  const searchTerm = useSelector(selectSearchTerm());
  const dispatch = useStoreDispatch();
  const { isSmall } = useBreakpoints();

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
        defaultValue={searchTerm}
        labelMode="hidden"
        searchButtonLabel={t('terminology-search')}
        visualPlaceholder={t('terminology-search-placeholder')}
        wrapperProps={{ style: { 'flexGrow': isSmall ? 1 : 0 } }}
        onSearch={value => {
          if (typeof value === 'string') dispatch(setSearchTerm(value));
        }}
        onChange={value => {
          if (value === '') dispatch(setSearchTerm(value));
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
}
