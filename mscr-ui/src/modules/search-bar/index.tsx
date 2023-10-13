import {SearchInput} from 'suomifi-ui-components';
import {useTranslation} from 'next-i18next';
import useUrlState, {initialUrlState} from 'yti-common-ui/utils/hooks/use-url-state';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {SEARCH_FIELD_PATTERN, TEXT_INPUT_MAX} from 'yti-common-ui/utils/constants';

export default function SearchBar() {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const isSearchPage = router.route === '/';

  // Does this work for our project? Copied from datamodel-ui
  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [searchInputValue, setSearchInputValue] = useState<string>(
    isSearchPage ? q : ''
  );

  const handleChange = (val: string) => {
    if (val.match(SEARCH_FIELD_PATTERN)) {
      setSearchInputValue(val ?? '');
    }
    if (val === '') search();
  };

  useEffect(() => {
    if (isSearchPage) {
      setSearchInputValue(q);
    }
  }, [q, setSearchInputValue, isSearchPage]);


  return (
    <SearchInput
      labelText={t('search.bar.label')}
      clearButtonLabel={t('search.bar.clear-button')}
      searchButtonLabel={t('search.bar.search-button')}
      value={searchInputValue ?? ''}
      onSearch={(value) => {
        if (typeof value === 'string') search(value);
      }}
      onChange={(value) => handleChange(value?.toString() ?? '')}
      maxLength={TEXT_INPUT_MAX}
    />
  );

  function search(q?: string) {
    if (isSearchPage) {
      patchUrlState({
        q: q ?? '',
        page: initialUrlState.page,
      });
    } else {
      return router.push(
        {
          pathname: '/',
          query: q ? { q } : {},
        },
        undefined,
        { shallow: true }
      );
    }
  }
}
