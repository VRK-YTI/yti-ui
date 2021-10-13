import React from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { SearchContainer } from './terminology-search-input.styles';

interface SearchInputProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

export function TerminologySearchInput({ keyword, setKeyword }: SearchInputProps) {
  return (
    <SearchContainer>
      <SearchInput
        clearButtonLabel="Tyhjennä haku"
        labelText="Hakukenttä"
        searchButtonLabel="Hae"
        onSearch={
          (value) => {
            setKeyword(value as string);
          }
        }
      />
    </SearchContainer>
  );
}
