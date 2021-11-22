import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SearchWrapper } from '../../../modules/header/header.styles';
import { Icon, SearchInput } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { setFilter, selectFilter } from '../terminology-search/terminology-search-slice';

interface HeaderSearchProps {
  isSmall: boolean;
}

export default function HeaderSearch({ isSmall }: HeaderSearchProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const filter = useSelector(selectFilter());


  return (
    <SearchWrapper isSmall={isSmall}>
      {!isSmall ? (
        <SearchInput
          clearButtonLabel=""
          labelText=""
          searchButtonLabel={t('terminology-search')}
          visualPlaceholder={t('terminology-search-placeholder')}
          onSearch={value => {
            if (typeof value === 'string') dispatch(setFilter(value));
          }}
          onChange={value => {
            if (value === '') dispatch(setFilter(value));
          }}
          defaultValue={filter}
        />
      ) : (
        <div><Icon icon="search" /></div>
      )}
    </SearchWrapper>
  );
}

