import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { setFilter, selectFilter } from './terminology-search-slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../../store';

export function TerminologySearchInput() {
  const dispatch = useStoreDispatch();
  const filter = selectFilter();

  return (
    <SearchInput
      clearButtonLabel="Tyhjennä haku"
      labelText="Hakukenttä"
      searchButtonLabel="Hae"
      onSearch={value => {
        if (typeof value === 'string') dispatch(setFilter(value));
      }}
      defaultValue={useSelector(filter)}
    />
  );
};
