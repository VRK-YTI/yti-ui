import React from 'react';
import { SearchInput } from 'suomifi-ui-components';

interface SearchInputProps {
  setFilter: (value: string | null) => void;
}

export function TerminologySearchInput({ setFilter }: SearchInputProps) {
  return (
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
      onChange={
        (value) => {
          if (value === '' || value === null) {
            setFilter(value as string);
          }
        }
      }
    />
  );
}
