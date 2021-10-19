import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useAppDispatch } from '../hooks';
import { SearchContainer } from './terminology-search-input.styles';
import { setFilter } from './terminology-search-slice'

export function TerminologySearchInput() {
  const dispatch = useAppDispatch();

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
        } }
      />
    </SearchContainer>
  );
}
