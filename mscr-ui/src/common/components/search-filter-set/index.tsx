import { FacetTitle } from '@app/common/components/search-filter-set/search-filter-set.styles';
import { Filter } from '@app/common/interfaces/search.interface';
import { Checkbox, CheckboxGroup } from 'suomifi-ui-components';
import useUrlState, { UrlState } from '@app/common/utils/hooks/use-url-state';

interface SearchFilterProps {
  title: string;
  filters: Filter[];
}

export default function SearchFilterSet({ title, filters }: SearchFilterProps) {
  return (
    <>
      <FacetTitle variant="h2">{title}</FacetTitle>
      {filters.map((f) => (
        <SearchFilter
          key={f.label}
          facet={f.facet}
          label={f.label}
          options={f.options}
        />
      ))}
    </>
  );
}

function SearchFilter(searchFilter: Filter) {
  const { urlState, patchUrlState } = useUrlState();

  const handleClick = (clickedOption: string) => {
    const currentFilter: string[] = urlState[searchFilter.facet];
    let newFilter: string[] = [];
    if (currentFilter.includes(clickedOption)) {
      newFilter = currentFilter.filter((option) => option !== clickedOption);
    } else {
      newFilter = currentFilter.concat(clickedOption);
    }
    const patch: Partial<UrlState> = {};
    patch[searchFilter.facet] = newFilter;
    patchUrlState(patch);
  };

  return (
    <CheckboxGroup labelText={searchFilter.label}>
      {searchFilter.options.map((option) => (
        <Checkbox key={option.key} onClick={() => handleClick(option.key)}>
          {option.label} ({option.count})
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
