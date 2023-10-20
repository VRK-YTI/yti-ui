import {
  RadioButton,
  RadioButtonGroup,
  SearchInput
} from 'suomifi-ui-components';
import {useTranslation} from 'next-i18next';
import useUrlState, {initialUrlState} from '@app/common/utils/hooks/use-url-state';
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

  // const scopes = [
  //   {name: 'in your workspace', key: 'personal'},
  //   {name: 'in all MSCR', key: 'all'}
  // ];
  // const [domain, setDomain] = useState('personal');

  const [selectedType, setSelectedType] = useState('ALL');
  const handleChange = (val: string) => {
    if (val.match(SEARCH_FIELD_PATTERN)) {
      setSearchInputValue(val ?? '');
    }
    if (val === '') search(selectedType);
  };

  useEffect(() => {
    if (isSearchPage) {
      setSearchInputValue(q);
    }
  }, [q, setSearchInputValue, isSearchPage]);


  return (
    <>
      <SearchInput
        labelText={t('search.bar.label')}
        clearButtonLabel={t('search.bar.clear-button')}
        searchButtonLabel={t('search.bar.search-button')}
        value={searchInputValue ?? ''}
        onSearch={(value) => {
          if (typeof value === 'string') search(selectedType, value);
        }}
        onChange={(value) => handleChange(value?.toString() ?? '')}
        maxLength={TEXT_INPUT_MAX}
      />
      <RadioButtonGroup
        labelText='Content type'
        name="type"
        value={selectedType}
        onChange={(newValue) => setSelectedType(newValue)}
      >
        <RadioButton
          value='ALL'
        >
          All
        </RadioButton>
        <RadioButton
          value='CROSSWALK'
        >
          Crosswalks
        </RadioButton>
        <RadioButton
          value='SCHEMA'
        >
          Schemas
        </RadioButton>
      </RadioButtonGroup>
      {/*<Dropdown*/}
      {/*  labelText='Scope'*/}
      {/*  defaultValue='personal'*/}
      {/*  value={domain}*/}
      {/*  onChange={(newValue) => setDomain(newValue)}*/}
      {/*>*/}
      {/*  {scopes.map((scope) => (*/}
      {/*    <DropdownItem key={scope.key} value={scope.key}>*/}
      {/*      {scope.name}*/}
      {/*    </DropdownItem>*/}
      {/*  ))}*/}
      {/*</Dropdown>*/}
    </>

  );

  function search(selectedType: string, q?: string) {
    if (isSearchPage) {
      patchUrlState({
        q: q ?? '',
        // domain: domain,
        type: selectedType == 'ALL' ? ['SCHEMA', 'CROSSWALK'] : [selectedType],
        page: initialUrlState.page,
      });
      console.log('we patched to', urlState);
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
