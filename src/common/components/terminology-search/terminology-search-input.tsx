import React, { useEffect, useState } from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { SearchContainer } from './terminology-search-input.styles';

import useTerminologySearch from '../../../../modules/terminology-search/terminology-search-api'
import { TerminologySearchResult } from '../../interfaces/terminology.interface';

interface SearchInputProps {
  setResults: (value: TerminologySearchResult | null) => void;
}

export function TerminologySearchInput({ setResults }: SearchInputProps) {
  const [filter, setFilter] = useState('');

  const { results, error, loading } = useTerminologySearch(filter);

  useEffect(() => {
    if (loading === false) {
      setResults(results)
      console.log("here", results)
    }
  }, [loading, filter])

  return (
    <SearchContainer>
      
      <SearchInput
        data-testid='search_input'
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={
          (value) => {
            setFilter(value as string);
          }
        }
        onChange={(value) => {
          if (value === '' || value === null) {
            setFilter(value as string);
          }
        }
        }
      />
    </SearchContainer>
  );
}
