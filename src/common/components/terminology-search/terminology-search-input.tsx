import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { SearchContainer } from './terminology-search-input.styles';
import { setFilter, selectFilter, useFetchSearchResultMutation } from './terminology-search-slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../../store';

export function TerminologySearchInput() {
  const dispatch = useStoreDispatch();
  const filter = selectFilter();

  const [fetchSearchResult, { isLoading }] = useFetchSearchResultMutation();

  return (
    <SearchContainer>
      <SearchInput
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={ value => {
          if (typeof value === 'string') dispatch(setFilter(value));
          if (typeof value === 'string' && !isLoading) fetchSearchResult(value);
        }}
        defaultValue={useSelector(filter)}
      />
    </SearchContainer>
  );
};
