import { SingleSelect } from 'suomifi-ui-components';
import { OrganizationSearchResult } from '@app/common/interfaces/terminology.interface';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/useUrlState';
import { DropdownWrapper } from './filter.styles';
import { useTranslation } from 'react-i18next';

interface OrganizationFilterProps {
  organizations?: OrganizationSearchResult[];
  title: string;
  visualPlaceholder?: string;
}

export default function OrganizationFilter({
  organizations,
  title,
  visualPlaceholder,
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
        onChange={(organization) =>
          patchUrlState({
            organization,
            page: initialUrlState.page,
          })
        }
      >
        {organizations.map((organization) => (
          <DropdownItem value={organization.id} key={organization.id}>
            {organization.properties.prefLabel.value}
          </DropdownItem>
        ))}
      </Dropdown>
    </DropdownWrapper>
  );
}
