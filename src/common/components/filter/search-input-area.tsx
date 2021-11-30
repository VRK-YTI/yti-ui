import { useTranslation } from 'react-i18next';
import { SearchInput } from 'suomifi-ui-components';

export default function SearchInputArea() {
  const { t } = useTranslation('common');

  return (
    <div>
      <SearchInput
        clearButtonLabel={t('vocabulary-filter-clear-filter')}
        searchButtonLabel={t('vocabulary-filter-search')}
        labelText={t('vocabulary-filter-filter-by-keyword')}
        visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
      />
    </div>
  );
}
