import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  MultiSelectData,
  Paragraph,
  SingleSelectData,
  Text,
} from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import {
  MultiselectSmBot,
  OrgCheckbox,
  OrgSingleSelect,
} from './new-terminology.styles';

export default function OrganizationSelector({ update }: any) {
  const user = useSelector(selectLogin());
  const { i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const [selectedOrganization, setSelectedOrganization] =
    useState<SingleSelectData | null>();
  const [selectedOtherOrganizations, setSelectedOtherOrganizations] = useState<
    MultiSelectData[]
  >([]);
  const [showOtherOrgSelector, setShowOtherOrgSelector] =
    useState<boolean>(false);

  useEffect(() => {
    update('mainOrg', selectedOrganization);
    update('otherOrgs', selectedOtherOrganizations);
  }, [selectedOrganization, selectedOtherOrganizations]);

  const adminOrgs: SingleSelectData[] = organizations?.map((org) => {
    if (user.organizationsInRole.ADMIN.includes(org.id.toString())) {
      const orgName = org.properties.prefLabel.value;

      if (orgName) {
        return {
          name: orgName,
          labelText: orgName,
          uniqueItemId: org.id,
          organizationId: org.type.graph.id,
        } as SingleSelectData;
      }
    }
  }) as SingleSelectData[];

  const handleSelectOrganization = (value: SingleSelectData | null) => {
    setSelectedOrganization(value);
    if (!value) {
      setShowOtherOrgSelector(false);
      setSelectedOtherOrganizations([]);
    }
  };

  return (
    <>
      {user.organizationsInRole.ADMIN.length > 1 ? (
        <>
          <OrgSingleSelect
            labelText="Sisällöntuottaja"
            hintText="Voit lisätä vain organisaation, joka on antanut sinulle muokkausoikeudet"
            ariaOptionsAvailableText="Options available"
            clearButtonLabel="Tyhjennä"
            isSmall={isSmall}
            items={adminOrgs}
            onItemSelectionChange={(item) => handleSelectOrganization(item)}
            noItemsText="no items"
            visualPlaceholder="Valitse organisaatio"
          />
          <OrgCheckbox
            checked={showOtherOrgSelector}
            onClick={(value) => setShowOtherOrgSelector(value.checkboxState)}
            disabled={!selectedOrganization}
          >
            Lisää muut vastuuorganisaatiot
          </OrgCheckbox>
          {showOtherOrgSelector && (
            <MultiselectSmBot
              labelText="Muut vastuuorganisaatiot"
              items={adminOrgs.filter(
                (adminOrgs) =>
                  adminOrgs.uniqueItemId !== selectedOrganization?.uniqueItemId
              )}
              chipListVisible={true}
              ariaChipActionLabel="Remove"
              ariaSelectedAmountText="organizations selected"
              ariaOptionsAvailableText="options available"
              ariaOptionChipRemovedText="removed"
              noItemsText="no items"
              visualPlaceholder="Valitse muut vastuuorganisaatiot"
              onItemSelectionsChange={(e) => setSelectedOtherOrganizations(e)}
              isSmall={isSmall}
            />
          )}
        </>
      ) : (
        <>
          <Paragraph>
            <Text variant="bold" smallScreen>
              Sisällöntuottaja
            </Text>
          </Paragraph>
          <Paragraph>
            <Text smallScreen>{adminOrgs[0].labelText}</Text>
          </Paragraph>
        </>
      )}
    </>
  );
}
