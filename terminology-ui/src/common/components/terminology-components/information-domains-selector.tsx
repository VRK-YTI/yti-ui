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
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

interface InformationDomainsSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
  initialData?: NewTerminologyInfo;
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
      ? initialData.infoDomains.map((domain) => ({
          labelText: domain.labelText,
          uniqueItemId: domain.uniqueItemId,
          chipText: domain.labelText,
          disabled: false,
        }))
      : []
  );

  const handleChange = (e: MultiSelectData[]) => {
    setSelectedInfoDomains(e);
    update({ key: 'infoDomains', data: e });
  };

  const infoDomains: MultiSelectData[] = informationDomains?.map(
    (infoDomain) => {
      const domainName = infoDomain.properties.prefLabel.value;

      if (domainName) {
        return {
          name: domainName,
          labelText: domainName,
          uniqueItemId: infoDomain.id,
          groupId: infoDomain.type.graph.id,
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
