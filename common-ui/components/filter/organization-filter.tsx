import { SingleSelect, SingleSelectData } from "suomifi-ui-components";
import { OrganizationSearchResult } from "@app/common/interfaces/terminology.interface";
import useUrlState, { initialUrlState } from "../../utils/hooks/use-url-state";
import { DropdownWrapper } from "./filter.styles";
import { useTranslation } from "next-i18next";

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
  const { t, i18n } = useTranslation();

  if (!organizations) {
    return null;
  }

  const selectedItem = organizations.find(
    (org) => org.uniqueItemId === urlState.organization
  );

  return (
    <DropdownWrapper>
      <SingleSelect
        labelText={title}
        clearButtonLabel={t("terminology-search-filter-clear-organization")}
        items={organizations}
        selectedItem={selectedItem}
        visualPlaceholder={visualPlaceholder}
        noItemsText={t("terminology-search-filter-no-matching-organizations")}
        ariaOptionsAvailableText={
          "terminology-search-filter-organizations-available"
        }
        onItemSelect={(uniqueItemId) =>
          patchUrlState({
            organization: uniqueItemId ?? undefined,
            page: initialUrlState.page,
          })
        }
        id="filter-organization-selector"
      />
    </DropdownWrapper>
  );
}
