import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { SearchContainer } from './terminology-search-input.styles';
import { setFilter, selectFilter } from './terminology-search-slice'

export function TerminologySearchInput() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);

  return (
    <SearchContainer>
      <SearchInput
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={ value => {
          if (typeof value === 'string') {
            dispatch(setFilter(value))
          }
        }}
        defaultValue={filter}
      />
    </SearchContainer>
  );
}
