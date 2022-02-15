import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import useUrlState, { initialUrlState } from '../../utils/hooks/useUrlState';
import PropertyValue from '../property-value';
import { DropdownPlaceholder, DropdownWrapper } from './filter.styles';

interface OrganizationFilterProps {
  organizations?: OrganizationSearchResult[];
  title: string;
  visualPlaceholder?: string;
}

export default function OrganizationFilter({
  organizations,
  title,
  visualPlaceholder
}: OrganizationFilterProps) {
  const { urlState, patchUrlState } = useUrlState();

  if (!organizations) {
    return null;
  }

  return (
    <DropdownWrapper>
      <Dropdown
        labelText={title}
        visualPlaceholder={
          <DropdownPlaceholder>{visualPlaceholder}</DropdownPlaceholder>
        }
        value={urlState.organization}
        onChange={organization => patchUrlState({
          organization,
          page: initialUrlState.page,
        })}
      >
        {organizations.map(organization => (
          <DropdownItem value={organization.id} key={organization.id}>
            <PropertyValue property={organization.properties.prefLabel} />
          </DropdownItem>
        ))}
      </Dropdown>
    </DropdownWrapper>
  );
}
