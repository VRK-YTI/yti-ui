import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import {
  BlankFieldset,
  MultiselectSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useEffect, useState } from 'react';

export interface OrganizationSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  initialData?: NewTerminologyInfo;
  disabled?: boolean;
}

export default function OrganizationSelector({
  update,
  userPosted,
  initialData,
  disabled,
}: OrganizationSelectorProps) {
  const user = useSelector(selectLogin());
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: organizations } = useGetOrganizationsQuery(i18n.language);
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    MultiSelectData[]
  >(
    initialData
      ? initialData.contributors.map((contributor) => ({
          labelText: contributor.labelText,
          uniqueItemId: contributor.uniqueItemId,
        }))
      : []
  );

  const adminOrgs: MultiSelectData[] = organizations
    ?.map((org) => {
      if (user.organizationsInRole.ADMIN.includes(org.id.toString())) {
        const orgName = org.properties.prefLabel.value;

        if (orgName) {
          return {
            name: orgName,
            labelText: orgName,
            uniqueItemId: org.id,
            organizationId: org.type.graph.id,
          } as MultiSelectData;
        }
      }
    })
    .filter((org) => org) as MultiSelectData[];

  useEffect(() => {
    if (adminOrgs.length === 1 && selectedOrganizations.length === 0) {
      setSelectedOrganizations(adminOrgs);
      update({ key: 'contributors', data: adminOrgs });
    }
  }, [adminOrgs, update, selectedOrganizations]);

  const handleSelectOrganizations = (value: MultiSelectData[]) => {
    setSelectedOrganizations(value);
    update({ key: 'contributors', data: value });
  };

  return (
    <BlankFieldset>
      {adminOrgs.length > 1 ? (
        <MultiselectSmBot
          labelText={t('orgs-label-text')}
          hintText={t('org-hint-text')}
          $isSmall={isSmall ? true : undefined}
          items={adminOrgs}
          onItemSelectionsChange={(e) => handleSelectOrganizations(e)}
          chipListVisible={true}
          noItemsText={t('no-orgs-available')}
          visualPlaceholder={t('choose-orgs')}
          status={
            userPosted && selectedOrganizations.length === 0
              ? 'error'
              : 'default'
          }
          defaultSelectedItems={selectedOrganizations ?? undefined}
          id="organizations-selector"
          ariaOptionsAvailableText={t('orgs-aria-options-available-text')}
          ariaChipActionLabel={t('aria-chip-action-label')}
          ariaSelectedAmountText={t('chosen-organizations')}
          ariaOptionChipRemovedText={t('organization-removed')}
          disabled={disabled}
        />
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
