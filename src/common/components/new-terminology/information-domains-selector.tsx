import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { useGetGroupsQuery } from '../terminology-search/terminology-search-slice';
import { MultiselectSmBot } from './new-terminology.styles';

export default function InformationDomainsSelector() {
  const { i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: informationDomains } = useGetGroupsQuery(i18n.language);
  const [selectedInfoDomains, setSelectedInfoDomains] = useState<MultiSelectData[]>([]);

  const infoDomains: MultiSelectData[] = informationDomains?.map(infoDomain => {
    const domainName = infoDomain.properties.prefLabel.value;

    if (domainName) {
      return {
        'name': domainName,
        'labelText': domainName,
        'uniqueItemId': infoDomain.id
      } as MultiSelectData;
    }
  }) as MultiSelectData[];

  return (
    <>
      <MultiselectSmBot
        labelText='Tietoalueet'
        hintText='Valitse sanastolle sen sisältöä kuvaavat tietoalueet. Tietoalue auttaa sanaston löydettävyydessä.'
        items={infoDomains}
        chipListVisible={true}
        ariaChipActionLabel="Remove"
        ariaSelectedAmountText="languages selected"
        ariaOptionsAvailableText="options available"
        ariaOptionChipRemovedText="removed"
        noItemsText='no items'
        visualPlaceholder='Valitse sanaston aihealueet'
        onItemSelectionsChange={(e) => setSelectedInfoDomains(e)}
        isSmall={isSmall}
      />
    </>
  );
}
