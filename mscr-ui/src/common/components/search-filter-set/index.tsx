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
          <SearchFilter key={f.name} name={f.name} options={f.options}/>
        </>
      ))}
    </>
  );
}

function SearchFilter(filter: Filter) {
  return (
    <CheckboxGroup labelText={filter.name}>
      {filter.options.map((option) => (
        <Checkbox key={option.name}>{option.name} ({option.count})</Checkbox>
      ))}
    </CheckboxGroup>
  );
}
