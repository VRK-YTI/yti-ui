import { Organizations } from '@app/common/interfaces/organizations.interface';
import { ServiceCategories } from '@app/common/interfaces/serviceCategories.interface';
import { useTranslation } from 'next-i18next';
import Filter, { InformationDomainFilter, KeywordFilter, LanguageFilter, OrganizationFilter } from 'yti-common-ui/filter';
import Separator from 'yti-common-ui/separator';

interface FrontPageFilterProps {
  organizations?: Organizations;
  serviceCategories?: ServiceCategories;
}

export default function FrontPageFilter({
  organizations,
  serviceCategories
}: FrontPageFilterProps) {
  const { i18n } = useTranslation();

  if (!organizations || !serviceCategories) {
    return (<></>);
  }

  return (
    <Filter>
      <KeywordFilter
        title='Hae sanalla'
        visualPlaceholder='Esim. päivähoito, opiskelu...'
      />
      <Separator />
      <OrganizationFilter
        organizations={organizations?.['@graph'].map(org => ({
          labelText: org.prefLabel.filter(l => l['@language'] === i18n.language)[0]['@value'],
          uniqueItemId: org['@id']
        })).sort((x, y) => x.labelText.localeCompare(y.labelText)) ?? []}
        title='Rajaa organisaation mukaan'
        visualPlaceholder='Valitse organisaatio'
      />
      <Separator />
      <LanguageFilter
        labelText='Rajaa kielen mukaan'
        languages={[]}
      />
      <Separator />
      <InformationDomainFilter
        title='Näytä tietoalueittain'
        domains={serviceCategories?.['@graph'].map(g => ({
          id: g['@id'],
          name: g.label.filter(l => l['@language'] === i18n.language)[0]['@value']
        })).sort((x, y) => x.name.localeCompare(y.name)) ?? []}
        counts={{}}
        isModal={false}
      />
    </Filter>
  );
}
