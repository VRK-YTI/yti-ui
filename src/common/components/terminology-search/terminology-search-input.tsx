import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { SearchContainer } from './terminology-search-input.styles';

import useTerminologySearch from '../../../../modules/search/terminology-search-api'
import { TerminologySearchResult } from '../../interfaces/terminology.interface';

interface SearchInputProps {
  setResults: (value: TerminologySearchResult | null) => void;
}

export function TerminologySearchInput({ setResults }: SearchInputProps) {
  
  const [results, setFilter, loading] = useTerminologySearch();

  if (!loading) {
    setResults(results)
  }

  return (
    <SearchContainer>
      <SearchInput
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={
          (value) => {
            setFilter(value as string);
          }
        }
      />
    </SearchContainer>
  );
}
