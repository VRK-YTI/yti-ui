import { SingleSelect, SingleSelectData } from 'suomifi-ui-components';
import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import { DropdownWrapper } from './filter.styles';
import { useTranslation } from 'next-i18next';

interface OrganizationFilterProps {
  organizations?: SingleSelectData[];
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

  return (
    <DropdownWrapper>
      <SingleSelect
        labelText={title}
        clearButtonLabel={t('terminology-search-filter-clear-organization')}
        items={organizations}
        defaultSelectedItem={organizations.find(
          (org) => org.uniqueItemId === urlState.organization
        )}
        visualPlaceholder={visualPlaceholder}
        ariaOptionsAvailableText={
          'terminology-search-filter-organizations-available'
        }
        onItemSelect={(uniqueItemId) =>
          patchUrlState({
            organization: uniqueItemId ?? undefined,
            page: initialUrlState.page,
          })
        }
        itemAdditionHelpText=""
        id="filter-organization-selector"
      />
    </DropdownWrapper>
  );
}
