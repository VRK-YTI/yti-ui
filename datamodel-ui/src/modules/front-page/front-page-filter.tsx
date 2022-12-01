import { Organizations } from '@app/common/interfaces/organizations.interface';
import { ServiceCategories } from '@app/common/interfaces/serviceCategories.interface';
import { getPropertyLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { SingleSelectData } from 'suomifi-ui-components';
import Filter, {
  InformationDomainFilter,
  KeywordFilter,
  LanguageFilter,
  OrganizationFilter,
  StatusFilterRadio,
  TypeFilterCheckbox,
} from 'yti-common-ui/filter';
import Separator from 'yti-common-ui/separator';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';

interface FrontPageFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  organizations?: Organizations;
  serviceCategories?: ServiceCategories;
  languages?: SingleSelectData[];
}

export default function FrontPageFilter({
  isModal,
  onModalClose,
  resultCount,
  organizations,
  serviceCategories,
  languages,
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
              labelText: getPropertyLanguageVersion({
                data: org.prefLabel,
                lang: i18n.language,
                appendLocale: true,
              }),
              uniqueItemId: org['@id'],
            }))
            .sort((x, y) => x.labelText.localeCompare(y.labelText)) ?? []
        }
        title={t('filter-by-organization')}
        visualPlaceholder={t('filter-by-organization-placeholder')}
      />
      <Separator />
      <LanguageFilter
        labelText={t('filter-by-language')}
        languages={languages}
      />
      <Separator />
      <TypeFilterCheckbox
        title={t('show-only')}
        items={[
          {
            value: 'library',
            label: t('library-with-count', { count: 0 }),
          },
          {
            value: 'profile',
            label: t('profile-with-count', { count: 0 }),
          },
        ]}
        isModal={isModal}
      />
      <Separator />
      <StatusFilterRadio
        title={t('show')}
        items={[
          {
            value: 'in-use',
            label: t('datamodels-in-use'),
            hintText: `${translateStatus('VALID', t)}, ${translateStatus(
              'DRAFT',
              t
            )}`,
          },
          {
            value: 'unused',
            label: t('datamodels-unused'),
            hintText: `${translateStatus('RETIRED', t)}, ${translateStatus(
              'SUPERSEDED',
              t
            )}, ${translateStatus('INVALID', t)}`,
          },
          {
            value: 'all',
            label: t('datamodels-all'),
          },
        ]}
        isModal={isModal}
      />
      <Separator />
      <InformationDomainFilter
        title={t('show-by-information-domain')}
        domains={
          serviceCategories?.['@graph']
            .map((g) => ({
              id: g['@id'],
              name: g.label
                ? g.label.filter(
                    (l) => (l['@language'] ?? '') === i18n.language
                  )?.[0]?.['@value']
                : '',
            }))
            .sort((x, y) => x.name.localeCompare(y.name)) ?? []
        }
        counts={{}}
        isModal={isModal}
      />
    </Filter>
  );
}
