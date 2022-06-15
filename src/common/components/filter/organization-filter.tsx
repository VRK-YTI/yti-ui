import { SingleSelect } from 'suomifi-ui-components';
import { OrganizationSearchResult } from '@app/common/interfaces/terminology.interface';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/useUrlState';
import { DropdownWrapper } from './filter.styles';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();

  if (!organizations) {
    return null;
  }

  const items = organizations.map((organization) => ({
    labelText: organization.properties.prefLabel.value,
    uniqueItemId: organization.id,
  }));

  const selectedItem = items.find(
    (item) => item.uniqueItemId === urlState.organization
  );
  return (
    <DropdownWrapper>
      <SingleSelect
        labelText={title}
        clearButtonLabel={t('terminology-search-filter-clear-organization')}
        items={items}
        selectedItem={selectedItem}
        visualPlaceholder={visualPlaceholder}
        noItemsText={t('terminology-search-filter-no-matching-organizations')}
        ariaOptionsAvailableText={
          'terminology-search-filter-organizations-available'
        }
        onItemSelect={(uniqueItemId) =>
          patchUrlState({
            organization: uniqueItemId ?? undefined,
            page: initialUrlState.page,
          })
        }
      />
    </DropdownWrapper>
  );
}
