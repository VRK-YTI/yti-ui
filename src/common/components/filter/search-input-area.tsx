import { useTranslation } from 'react-i18next';
import { SearchInput } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';

interface SearchInputAreaProps {
  filter: any;
  setFilter: any;
  title: string;
  visualPlaceholder: string;
}

export default function SearchInputArea({ filter, setFilter, title, visualPlaceholder }: SearchInputAreaProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();

  const handleKeywordChange = (s: string) => {
    if (s !== '') {
      dispatch(setFilter({ ...filter, tKeyword: s }));
      return;
    } else {
      dispatch(setFilter({ ...filter, keyword: s, tKeyword: s }));
      return;
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
        value={filter.tKeyword}
        visualPlaceholder={visualPlaceholder}
        onChange={(value) => handleKeywordChange(value as string)}
        onSearch={(value) => handleKeyword(value as string)}
      />
    </div>
  );
}
