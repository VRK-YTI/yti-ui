import { Organizations } from '@app/common/interfaces/organizations.interface';
import { ServiceCategories } from '@app/common/interfaces/serviceCategories.interface';
import { useTranslation } from 'next-i18next';
import Filter, {
  InformationDomainFilter,
  KeywordFilter,
  LanguageFilter,
  OrganizationFilter,
} from 'yti-common-ui/filter';
import Separator from 'yti-common-ui/separator';

interface FrontPageFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  organizations?: Organizations;
  serviceCategories?: ServiceCategories;
}

export default function FrontPageFilter({
  isModal,
  onModalClose,
  resultCount,
  organizations,
  serviceCategories,
}: FrontPageFilterProps) {
  const { t, i18n } = useTranslation('common');

  if (!organizations || !serviceCategories) {
    return <></>;
  }

  return (
    <Filter
      isModal={isModal}
      onModalClose={onModalClose}
      resultCount={resultCount}
    >
      <KeywordFilter
        title={t('filter-by-keyword')}
        visualPlaceholder={t('filter-by-keyword-placeholder')}
      />
      <Separator />
      <OrganizationFilter
        organizations={
          organizations?.['@graph']
            .map((org) => ({
              labelText: org.prefLabel.filter(
                (l) => l['@language'] === i18n.language
              )[0]['@value'],
              uniqueItemId: org['@id'],
            }))
            .sort((x, y) => x.labelText.localeCompare(y.labelText)) ?? []
        }
        title={t('filter-by-organization')}
        visualPlaceholder={t('filter-by-organization-placeholder')}
      />
      <Separator />
      <LanguageFilter labelText={t('filter-by-language')} languages={[]} />
      <Separator />
      <InformationDomainFilter
        title="Näytä tietoalueittain"
        domains={
          serviceCategories?.['@graph']
            .map((g) => ({
              id: g['@id'],
              name: g.label.filter((l) => l['@language'] === i18n.language)[0][
                '@value'
              ],
            }))
            .sort((x, y) => x.name.localeCompare(y.name)) ?? []
        }
        counts={{}}
        isModal={isModal}
      />
    </Filter>
  );
}
