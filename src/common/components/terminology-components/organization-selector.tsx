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
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import {
  BlankFieldset,
  MultiselectSmBot,
  OrgCheckbox,
  OrgSingleSelect,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

export interface OrganizationSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  initialData?: NewTerminologyInfo;
}

export default function OrganizationSelector({
  update,
  userPosted,
  initialData,
}: OrganizationSelectorProps) {
  const user = useSelector(selectLogin());
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const [selectedOrganization, setSelectedOrganization] =
    useState<SingleSelectData | null>(
      initialData?.mainOrg
        ? {
            labelText: initialData.mainOrg.labelText,
            uniqueItemId: initialData.mainOrg?.uniqueItemId,
          }
        : null
    );
  const [, setSelectedOtherOrganizations] = useState<MultiSelectData[]>([]);
  const [showOtherOrgSelector, setShowOtherOrgSelector] =
    useState<boolean>(false);
  const [mainOrgInitiated, setMainOrgInitiated] = useState(false);

  const adminOrgs: SingleSelectData[] = organizations
    ?.map((org) => {
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
    })
    .filter((org) => org) as SingleSelectData[];

  useEffect(() => {
    if (adminOrgs.length === 1 && !mainOrgInitiated) {
      update({ key: 'mainOrg', data: adminOrgs[0] });
      setMainOrgInitiated(true);
    }
  }, [adminOrgs, update, mainOrgInitiated]);

  const handleSelectOrganization = (value: SingleSelectData | null) => {
    setSelectedOrganization(value);
    update({ key: 'mainOrg', data: value });
    update({ key: 'otherOrgs', data: [] });

    if (!value) {
      setShowOtherOrgSelector(false);
      setSelectedOtherOrganizations([]);
    }
  };

  const handleSelectedOtherOrganizations = (value: MultiSelectData[]) => {
    setSelectedOtherOrganizations(value);
    update({ key: 'otherOrgs', data: value });
  };

  return (
    <BlankFieldset>
      {adminOrgs.length > 1 ? (
        <>
          <OrgSingleSelect
            labelText={t('org-label-text')}
            hintText={t('org-hint-text')}
            ariaOptionsAvailableText={t('org-aria-options-available-text')}
            clearButtonLabel={t('clear-button-label')}
            $isSmall={isSmall ? true : undefined}
            items={adminOrgs}
            onItemSelectionChange={(item) => handleSelectOrganization(item)}
            noItemsText={t('org-no-items')}
            visualPlaceholder={t('org-visual-placeholder')}
            status={userPosted && !selectedOrganization ? 'error' : 'default'}
            defaultSelectedItem={selectedOrganization ?? undefined}
          />
          <OrgCheckbox
            checked={showOtherOrgSelector}
            onClick={(value) => setShowOtherOrgSelector(value.checkboxState)}
            disabled={!selectedOrganization}
          >
            {t('add-other-organizations')}
          </OrgCheckbox>
          {showOtherOrgSelector && (
            <MultiselectSmBot
              labelText={t('other-orgs-label-text')}
              items={adminOrgs.filter(
                (adminOrgs) =>
                  adminOrgs.uniqueItemId !== selectedOrganization?.uniqueItemId
              )}
              chipListVisible={true}
              ariaChipActionLabel={t('aria-chip-action-label')}
              ariaSelectedAmountText={t('chosen-other-organizations')}
              ariaOptionsAvailableText={t(
                'other-orgs-aria-options-available-text'
              )}
              ariaOptionChipRemovedText={t('organization-removed')}
              noItemsText={t('no-other-orgs-available')}
              visualPlaceholder={t('choose-other-orgs')}
              onItemSelectionsChange={(e) =>
                handleSelectedOtherOrganizations(e)
              }
              $isSmall={isSmall ? true : undefined}
            />
          )}
        </>
      ) : (
        <>
          <Paragraph>
            <Text variant="bold" smallScreen>
              {t('content-creator')}
            </Text>
          </Paragraph>
          <Paragraph marginBottomSpacing="m">
            <Text smallScreen>{adminOrgs[0].labelText}</Text>
          </Paragraph>
        </>
      )}
    </BlankFieldset>
  );
}
