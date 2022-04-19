import { useTranslation } from 'next-i18next';
import { useState } from 'react';
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
  BlankFieldset,
  MultiselectSmBot,
  OrgCheckbox,
  OrgSingleSelect,
} from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

export interface OrganizationSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
}

export default function OrganizationSelector({
  update,
  userPosted,
}: OrganizationSelectorProps) {
  const user = useSelector(selectLogin());
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const [selectedOrganization, setSelectedOrganization] =
    useState<SingleSelectData | null>();
  const [, setSelectedOtherOrganizations] = useState<MultiSelectData[]>([]);
  const [showOtherOrgSelector, setShowOtherOrgSelector] =
    useState<boolean>(false);

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
      {user.organizationsInRole.ADMIN.length > 1 ? (
        <>
          <OrgSingleSelect
            labelText={t('org-label-text')}
            hintText={t('org-hint-text')}
            ariaOptionsAvailableText={t('org-aria-options-available-text')}
            clearButtonLabel={t('clear-button-label')}
            issmall={isSmall ? true : undefined}
            items={adminOrgs}
            onItemSelectionChange={(item) => handleSelectOrganization(item)}
            noItemsText={t('org-no-items')}
            visualPlaceholder={t('org-visual-placeholder')}
            status={userPosted && !selectedOrganization ? 'error' : 'default'}
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
              issmall={isSmall ? true : undefined}
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
          <Paragraph>
            <Text smallScreen>{adminOrgs[0].labelText}</Text>
          </Paragraph>
        </>
      )}
    </BlankFieldset>
  );
}
