import React from 'react';
import { Button, SearchInput } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectFilter, setFilter } from '../terminology-search/terminology-search-slice';
import { useStoreDispatch } from '../../../store';
import IconButton from '../icon-button/icon-button';
import { useBreakpoints } from '../media-query/media-query-context';

export interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderSearch({ isSearchOpen, setIsSearchOpen }: HeaderSearchProps) {
  const { t } = useTranslation('common');
  const filter = useSelector(selectFilter());
  const dispatch = useStoreDispatch();
  const { isSmall } = useBreakpoints();

  if (isSmall && !isSearchOpen) {
    return (
      <IconButton
        icon="search"
        aria-label="Avaa haku"
        onClick={() => setIsSearchOpen(true)}
      />
    );
  }

  return (
    <>
      <SearchInput
        clearButtonLabel=""
        labelText=""
        defaultValue={filter}
        labelMode="hidden"
        searchButtonLabel={t('terminology-search')}
        visualPlaceholder={t('terminology-search-placeholder')}
        wrapperProps={{ style: { 'flexGrow': isSmall ? 1 : 0 } }}
        onSearch={value => {
          if (typeof value === 'string') dispatch(setFilter(value));
        }}
        onChange={value => {
          if (value === '') dispatch(setFilter(value));
        }}
      />
      {isSmall ? (
        <Button
          onClick={() => setIsSearchOpen(false)}
          variant="secondaryNoBorder"
        >
          Sulje
        </Button>
      ) : null}
    </>
  );
}
