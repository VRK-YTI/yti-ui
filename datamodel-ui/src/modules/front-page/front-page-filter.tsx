import { useGetCountQuery } from '@app/common/components/counts/counts.slice';
import { Organization } from '@app/common/interfaces/organizations.interface';
import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
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
  organizations?: Organization[];
  serviceCategories?: ServiceCategory[];
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
  const { data: counts } = useGetCountQuery();

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
        organizations={organizations.map((org) => ({
          labelText: getLanguageVersion({
            data: org.label,
            lang: i18n.language,
            appendLocale: true,
          }),
          uniqueItemId: org.id.replaceAll('urn:uuid:', ''),
        }))}
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
            label: t('library-with-count', {
              count: counts?.counts.types.LIBRARY ?? 0,
            }),
          },
          {
            value: 'profile',
            label: t('profile-with-count', {
              count: counts?.counts.types.PROFILE ?? 0,
            }),
          },
        ]}
        isModal={isModal}
      />
      <Separator />
      <StatusFilterRadio
        title={t('show')}
        items={[
          {
            value: 'VALID,DRAFT',
            label: t('datamodels-in-use'),
            hintText: `${translateStatus('VALID', t)}, ${translateStatus(
              'DRAFT',
              t
            )}`,
          },
          {
            value: 'RETIRED,SUPERSEDED,INVALID',
            label: t('datamodels-unused'),
            hintText: `${translateStatus('RETIRED', t)}, ${translateStatus(
              'SUPERSEDED',
              t
            )}, ${translateStatus('INVALID', t)}`,
          },
          {
            value: 'VALID,DRAFT,RETIRED,SUPERSEDED,INVALID',
            label: t('datamodels-all'),
          },
        ]}
        isModal={isModal}
      />
      <Separator />
      <InformationDomainFilter
        title={t('show-by-information-domain')}
        domains={serviceCategories.map((g) => ({
          id: g.identifier,
          name: getLanguageVersion({
            data: g.label,
            lang: i18n.language,
            appendLocale: true,
          }),
        }))}
        counts={counts?.counts.groups}
        isModal={isModal}
      />
    </Filter>
  );
}
