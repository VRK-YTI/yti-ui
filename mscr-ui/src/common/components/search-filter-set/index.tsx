import {FacetTitle} from '@app/common/components/search-filter-set/search-filter-set.styles';
import {Filter} from '@app/common/interfaces/search.interface';
import {Checkbox, CheckboxGroup} from 'suomifi-ui-components';

interface SearchFilterProps {
  title: string;
  filters: Filter[];
}

export default function SearchFilterSet({ title, filters }: SearchFilterProps) {
  return (
    <>
      <FacetTitle variant="h2">{title}</FacetTitle>
      {filters.map((f) => (
        <>
          <SearchFilter key={f.key} label={f.label} options={f.options}/>
        </>
      ))}
    </>
  );
}

function SearchFilter(filter: Filter) {
  return (
    <CheckboxGroup labelText={filter.label}>
      {filter.options.map((option) => (
        <Checkbox key={option.key}>{option.label} ({option.count})</Checkbox>
      ))}
    </CheckboxGroup>
  );
}
