import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import Title from 'yti-common-ui/title';
import FrontPageFilter from './front-page-filter';
import {
  FilterMobileButton,
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
} from './front-page.styles';
import SearchResults, {
  SearchResultData,
} from 'yti-common-ui/search-results/search-results';
import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetSearchModelsQuery } from '@app/common/components/search-models/search-models.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  IconApplicationProfile,
  IconGrid,
  Modal,
  ModalContent,
  SingleSelectData,
} from 'suomifi-ui-components';
import useUrlState, {
  initialUrlState,
} from 'yti-common-ui/utils/hooks/use-url-state';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import Pagination from 'yti-common-ui/pagination';
import {
  translateModelType,
  translateResourceType,
  translateResultType,
} from '@app/common/utils/translation-helpers';
import ModelFormModal from '../model-form/model-form-modal';
import { useGetLanguagesQuery } from '@app/common/components/code/code.slice';
import { useGetCountQuery } from '@app/common/components/counts/counts.slice';
import { inUseStatusList } from '@app/common/utils/status-list';

export default function FrontPage() {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );
  const { data: organizationsData } = useGetOrganizationsQuery({
    sortLang: i18n.language,
  });
  const { data: languagesData } = useGetLanguagesQuery();
  const { data: counts } = useGetCountQuery(initialUrlState);
  const { data: searchModels } = useGetSearchModelsQuery({
    urlState,
    lang: i18n.language,
  });
  const [showModal, setShowModal] = useState(false);

  const organizations = useMemo(() => {
    if (!organizationsData) {
      return [];
    }

    return organizationsData.map((org) => {
      return {
        id: org.id,
        label: org.label[i18n.language] ?? org.label['fi'],
      };
    });
  }, [organizationsData, i18n.language]);

  const serviceCategories = useMemo(() => {
    if (!serviceCategoriesData) {
      return [];
    }

    return serviceCategoriesData.map((category) => ({
      id: category.identifier,
      label: category.label[i18n.language],
    }));
  }, [serviceCategoriesData, i18n.language]);

  const languages: SingleSelectData[] = useMemo(() => {
    if (!languagesData || languagesData.results.length < 1) {
      return [];
    }

    const languages = languagesData.results
      .filter((lang) => counts && counts.counts.languages[lang.codeValue])
      .map((lang) => {
        return {
          labelText: lang.codeValue,
          uniqueItemId: lang.codeValue,
        };
      });
    const promotedOrder = ['fi', 'sv', 'en'];
    const promoted: SingleSelectData[] = [];
    const otherLanguages = languages.reduce((langList, lang) => {
      promotedOrder.includes(lang.uniqueItemId)
        ? promoted.push(lang)
        : langList.push(lang);
      return langList;
    }, [] as SingleSelectData[]);

    promoted.sort(
      (a, b) =>
        promotedOrder.indexOf(a.uniqueItemId) -
        promotedOrder.indexOf(b.uniqueItemId)
    );
    return [...promoted, ...otherLanguages];
  }, [languagesData, counts]);

  const [data, extra]: [
    SearchResultData[],
    {
      [key: string]: {
        type: string;
        label: string;
        id: string;
        uri: string;
      }[];
    }
  ] = useMemo(() => {
    if (!searchModels || !organizationsData || !serviceCategoriesData) {
      return [[], {}];
    }

    const modelResults = searchModels.responseObjects.map((object) => {
      const contributors: string[] = object.contributor
        .map((c) =>
          getLanguageVersion({
            data: organizationsData.find((o) => o.id === c)?.label,
            lang: i18n.language,
            appendLocale: true,
          })
        )
        .filter((c) => c && c.length > 0);

      const partOf: string[] = object.isPartOf
        .map((p) =>
          getLanguageVersion({
            data: serviceCategoriesData.find((c) => c.identifier === p)?.label,
            lang: i18n.language,
          })
        )
        .filter((p) => p.length > 0);

      return {
        id: object.id,
        contributors: contributors,
        description: getLanguageVersion({
          data: object.comment,
          lang: i18n.language,
        }),
        icon:
          object.type === 'PROFILE' ? <IconApplicationProfile /> : <IconGrid />,
        status: object.status,
        partOf: partOf,
        version: object.version,
        identifier: object.prefix,
        title: getLanguageVersion({
          data: object.label,
          lang: i18n.language,
          appendLocale: true,
        }),
        titleLink: `/model/${object.prefix}${
          object.version ? `?ver=${object.version}` : ''
        }`,
        type: translateModelType(object.type, t),
      };
    });

    const extra: {
      [key: string]: { type: string; label: string; id: string; uri: string }[];
    } = {};
    searchModels.responseObjects.forEach((object) => {
      const resources = object.matchingResources.map((resource) => {
        const label = getLanguageVersion({
          data: resource.label,
          lang: i18n.language,
          appendLocale: true,
        });

        const modelId = resource.curie.split(':')[0];
        const versionPart = resource.fromVersion
          ? `?ver=${resource.fromVersion}`
          : '';
        const resourceType =
          resource.resourceType == 'ATTRIBUTE'
            ? 'attribute'
            : resource.resourceType == 'ASSOCIATION'
            ? 'association'
            : 'class';

        const uri = `/model/${modelId}/${resourceType}/${resource.identifier}${versionPart}`;

        return {
          type: resource.resourceType,
          label:
            resource.highlights['label.fi.keyword']?.[0] ||
            resource.highlights['label.fi']?.[0] ||
            label,
          id: resource.id,
          uri: uri,
        };
      });
      if (resources.length > 0) {
        extra[object.id] = resources;
      }
    });

    return [modelResults, extra];
  }, [
    searchModels,
    serviceCategoriesData,
    organizationsData,
    i18n.language,
    t,
  ]);

  return (
    <main id="main">
      <Title
        title={t('data-vocabularies')}
        noBreadcrumbs={true}
        editButton={<ModelFormModal />}
        extra={
          <TitleDescriptionWrapper $isSmall={isSmall}>
            <Description id="page-description">
              {t('service-description')}
            </Description>
          </TitleDescriptionWrapper>
        }
      />

      {isSmall && (
        <FilterMobileButton
          variant="secondary"
          fullWidth
          onClick={() => setShowModal(!showModal)}
          id="mobile-filter-button"
        >
          {t('filter-list')}
        </FilterMobileButton>
      )}
      <ResultAndFilterContainer>
        {!isSmall ? (
          <FrontPageFilter
            organizations={organizationsData}
            serviceCategories={serviceCategoriesData}
            languages={languages}
          />
        ) : (
          <Modal
            appElementId="__next"
            visible={showModal}
            onEscKeyDown={() => setShowModal(false)}
            variant="smallScreen"
            style={{ border: 'none' }}
          >
            <ModalContent style={{ padding: '0' }}>
              <FrontPageFilter
                isModal
                onModalClose={() => setShowModal(false)}
                resultCount={searchModels?.totalHitCount}
                organizations={organizationsData}
                serviceCategories={serviceCategoriesData}
                languages={languages}
              />
            </ModalContent>
          </Modal>
        )}
        <ResultAndStatsWrapper id="search-results-wrapper">
          <SearchResults
            data={data}
            organizations={organizations}
            domains={serviceCategories}
            types={[
              {
                id: 'profile',
                label: t('profile'),
              },
              {
                id: 'library',
                label: t('library'),
              },
            ]}
            partOfText={t('card-information-domains')}
            noDescriptionText={t('no-description')}
            tagsHiddenTitle={''}
            tagsTitle={t('results-with-current', {
              count: searchModels?.totalHitCount ?? 0,
            })}
            withDefaultStatuses={inUseStatusList}
            extra={{
              typedExpander: {
                translateResultType: translateResourceType,
                translateGroupType: translateResultType,
                deepHits: extra,
              },
            }}
          />
          <Pagination
            maxPages={Math.ceil((searchModels?.totalHitCount ?? 1) / 50)}
          />
        </ResultAndStatsWrapper>
      </ResultAndFilterContainer>
    </main>
  );
}
