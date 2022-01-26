// OBSOLETE
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import useQueryParam from '../../utils/hooks/useQueryParam';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { VocabularyState } from '../vocabulary/vocabulary-slice';

interface SearchInputAreaProps {
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  visualPlaceholder: string;
  isModal?: boolean;
}

export default function SearchInputArea({
  filter,
  isModal = false,
  setFilter,
  title,
  visualPlaceholder
}: SearchInputAreaProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const [keyword] = useQueryParam('q');
  const [inputValue, setInputValue] = useState(keyword);

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const handleKeywordChange = (s: string) => {
    setInputValue(s);

    if (s === '') {
      dispatch(setFilter({...filter, keyword: s}));
    }
  };

  const handleKeyword = (s: string) => {
    dispatch(setFilter({ ...filter, keyword: s }));
  };

  return (
    <div>
      <SearchInput
        clearButtonLabel={t('vocabulary-filter-clear-filter')}
        searchButtonLabel={t('vocabulary-filter-search')}
        labelText={title}
        value={inputValue}
        visualPlaceholder={visualPlaceholder}
        onChange={(value) => handleKeywordChange(value as string)}
        onSearch={(value) => handleKeyword(value as string)}
        fullWidth={isModal}
      />
    </div>
  );
}
