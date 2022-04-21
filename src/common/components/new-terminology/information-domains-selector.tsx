import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetGroupsQuery } from '../terminology-search/terminology-search.slice';
import { BlankFieldset, MultiselectSmBot } from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

interface InformationDomainsSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
}

export default function InformationDomainsSelector({
  update,
  userPosted,
}: InformationDomainsSelectorProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: informationDomains } = useGetGroupsQuery(i18n.language);
  const [selectedInfoDomains, setSelectedInfoDomains] = useState<
    MultiSelectData[]
  >([]);

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
        labelText={t('info-domains')}
        hintText={t('info-domains-hint')}
        items={infoDomains}
        chipListVisible={true}
        ariaChipActionLabel={t('aria-chip-action-label')}
        ariaSelectedAmountText={t('info-domains-selected')}
        ariaOptionsAvailableText={t('info-domains-available')}
        ariaOptionChipRemovedText={t('aria-option-chip-removed-text')}
        noItemsText={t('no-info-domains-available')}
        visualPlaceholder={t('info-domains-placeholder')}
        onItemSelectionsChange={(e) => handleChange(e)}
        issmall={isSmall ? true : undefined}
        status={
          userPosted && selectedInfoDomains.length === 0 ? 'error' : 'default'
        }
      />
    </BlankFieldset>
  );
}
