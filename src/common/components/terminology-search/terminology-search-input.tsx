import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { SearchContainer } from './terminology-search-input.styles';
import { setFilter, selectFilter } from './terminology-search-slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../../store';

export function TerminologySearchInput() {
  const dispatch = useStoreDispatch();
  const filter = selectFilter();

  return (
    <SearchContainer>
      {console.log(filter)}
      <SearchInput
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={ value => {
          if (typeof value === 'string') dispatch(setFilter(value));
        }}
        defaultValue={useSelector(filter)}
      />
    </SearchContainer>
  );
};
