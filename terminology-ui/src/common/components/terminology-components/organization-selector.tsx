import { useTranslation } from 'next-i18next';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import {
  BlankFieldset,
  MultiselectSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { useEffect, useMemo, useState } from 'react';
import { checkPermission } from '@app/common/utils/has-permission';
import { useSelector } from 'react-redux';
import { selectLogin } from '../login/login.slice';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { TerminologyForm } from '@app/modules/new-terminology/info-manual';

export interface OrganizationSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  initialData?: TerminologyForm;
  disabled?: boolean;
}

export default function OrganizationSelector({
  update,
  userPosted,
  initialData,
  disabled,
}: OrganizationSelectorProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const user = useSelector(selectLogin());
  const {
    data: organizations,
    isLoading,
    isError,
  } = useGetOrganizationsQuery({
    language: i18n.language,
    showChildOrganizations: true,
  });
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    MultiSelectData[]
  >(
    initialData
      ? initialData.organizations.map((organization) => ({
          labelText: organization.labelText,
          uniqueItemId: organization.uniqueItemId,
        }))
      : []
  );

  const adminOrgs: MultiSelectData[] = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }

    return organizations
      ?.map((org) => {
        if (
          checkPermission({
            user: user,
            actions: ['CREATE_TERMINOLOGY'],
            targetOrganizations: [org.id.toString()],
          })
        ) {
          const orgName = getLanguageVersion({
            data: org.label,
            lang: i18n.language,
          });

          if (orgName) {
            return {
              name: orgName,
              labelText: orgName,
              uniqueItemId: org.id,
            } as MultiSelectData;
          }
        }
      })
      .filter((org) => org) as MultiSelectData[];
  }, [organizations, isLoading, isError, user]);

  useEffect(() => {
    if (adminOrgs?.length === 1 && selectedOrganizations.length === 0) {
      setSelectedOrganizations(adminOrgs);
      update({ key: 'organizations', data: adminOrgs });
    }
  }, [adminOrgs, update, selectedOrganizations]);

  const handleSelectOrganizations = (value: MultiSelectData[]) => {
    setSelectedOrganizations(value);
    update({ key: 'organizations', data: value });
  };

  return (
    <BlankFieldset>
      {adminOrgs?.length > 1 ? (
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
          loading={false}
        />
      ) : (
        <>
          <Paragraph>
            <Text variant="bold" smallScreen>
              {t('content-creator')}
            </Text>
          </Paragraph>
          <Paragraph mb="m">
            <Text smallScreen>{adminOrgs[0]?.labelText}</Text>
          </Paragraph>
        </>
      )}
    </BlankFieldset>
  );
}
