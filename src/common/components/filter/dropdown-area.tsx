import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { DropdownPlaceholder, DropdownWrapper } from './filter.styles';

interface DropdownProps {
  data?: OrganizationSearchResult[];
  filter: SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  visualPlaceholder?: string;
}

export default function DropdownArea({
  data,
  filter,
  setFilter,
  title,
  visualPlaceholder
}: DropdownProps) {
  const dispatch = useStoreDispatch();

  if (!data) {
    return <></>;
  }

  const handleChange = (value: string) => {
    let id = '';
    data.forEach((d) => {
      if (d.properties.prefLabel.value === value) {
        id = d.id;
      }
    });
    dispatch(setFilter({ ...filter, showByOrg: { id: id, value: value } }));
  };

  // Returns dropdown with given data values.
  return (
    <DropdownWrapper>
      <Dropdown
        labelText={title}
        visualPlaceholder={
          <DropdownPlaceholder>
            {visualPlaceholder}
          </DropdownPlaceholder>
        }
        value={filter.showByOrg.value}
        onChange={(value) => handleChange(value)}
      >
        {data.map((value: any, idx: number) => {
          const name = value.properties.prefLabel.value ?? '';
          return (
            <DropdownItem
              value={name}
              key={`dropdown-${value}-${idx}`}
            >
              {name}
            </DropdownItem>
          );
        })}
      </Dropdown>
    </DropdownWrapper>
  );

}
