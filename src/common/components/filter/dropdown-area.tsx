import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { getPropertyValue } from '../property-value/get-property-value';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { DropdownPlaceholder, DropdownWrapper } from './filter.styles';

/**
 * Error handling:
 * - if visualPlaceholder is missing
 *   should other value be used?
 */

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
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();

  if (!data) {
    return <></>;
  }

  const handleChange = (value: string) => {
    let id = '';
    data.forEach((d) => {
      if (getPropertyValue({ property: d.properties.prefLabel, language: i18n.language }) === value) {
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
          const name = getPropertyValue({ property: value.properties?.prefLabel, language: i18n?.language }) ?? '';
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
