import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetGroupsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import {
  BlankFieldset,
  MultiselectSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { TerminologyForm } from '@app/modules/new-terminology/info-manual';

interface InformationDomainsSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  initialData?: TerminologyForm;
  disabled?: boolean;
}

export default function InformationDomainsSelector({
  update,
  userPosted,
  initialData,
  disabled,
}: InformationDomainsSelectorProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: informationDomains } = useGetGroupsQuery(i18n.language);
  const [selectedInfoDomains, setSelectedInfoDomains] = useState<
    MultiSelectData[]
  >(
    initialData
      ? initialData.groups.map((group) => ({
          labelText: group.labelText,
          uniqueItemId: group.uniqueItemId,
          chipText: group.labelText,
          disabled: false,
        }))
      : []
  );

  const handleChange = (e: MultiSelectData[]) => {
    setSelectedInfoDomains(e);
    update({ key: 'groups', data: e });
  };

  const infoDomains: MultiSelectData[] = informationDomains?.map(
    (infoDomain) => {
      const domainName = getLanguageVersion({
        data: infoDomain.label,
        lang: i18n.language,
      });

      if (domainName) {
        return {
          name: domainName,
          labelText: domainName,
          uniqueItemId: infoDomain.identifier,
        } as MultiSelectData;
      }
    }
  ) as MultiSelectData[];

  return (
    <BlankFieldset>
      <MultiselectSmBot
        items={infoDomains ?? []}
        hintText={t('info-domains-hint')}
        labelText={t('info-domains')}
        visualPlaceholder={t('info-domains-placeholder')}
        noItemsText={t('no-info-domains-available')}
        loading={false}
        chipListVisible={true}
        ariaSelectedAmountText={t('info-domains-selected')}
        ariaOptionsAvailableText={t('info-domains-available')}
        ariaOptionChipRemovedText={t('aria-option-chip-removed-text')}
        ariaChipActionLabel={t('aria-chip-action-label')}
        $isSmall={isSmall ? true : undefined}
        disabled={disabled}
        status={
          userPosted && selectedInfoDomains.length === 0 ? 'error' : 'default'
        }
        defaultSelectedItems={selectedInfoDomains}
        onItemSelectionsChange={(e) => handleChange(e)}
        id="information-domain-selector"
      />
    </BlankFieldset>
  );
}
