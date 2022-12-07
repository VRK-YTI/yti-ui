import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/serviceCategories/serviceCategories.slice';
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
import { useGetSearchModelsQuery } from '@app/common/components/searchModels/searchModels.slice';
import {
  getLanguageVersion,
  getPropertyLanguageVersion,
} from '@app/common/utils/get-language-version';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { Modal, ModalContent, SingleSelectData } from 'suomifi-ui-components';
import useUrlState from 'yti-common-ui/utils/hooks/use-url-state';

export default function FrontPage() {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: serviceCategories } = useGetServiceCategoriesQuery();
  const { data: organizations } = useGetOrganizationsQuery();
  const { data: searchModels } = useGetSearchModelsQuery({ urlState });
  const [showModal, setShowModal] = useState(false);

  const languages: SingleSelectData[] = useMemo(() => {
    if (!searchModels || searchModels.models.length < 1) {
      return [];
    }

    let languages: SingleSelectData[] = [];

    searchModels.models.forEach((m) => {
      if (languages.length === 0) {
        languages = m.language.map((l) => ({
          labelText: l,
          uniqueItemId: l,
        }));
      } else {
        m.language.forEach((l) => {
          if (!languages.map((lang) => lang.uniqueItemId).includes(l)) {
            languages = [...languages, { labelText: l, uniqueItemId: l }];
          }
        });
      }
    });

    return languages;
  }, [searchModels]);

  const data: SearchResultData[] = useMemo(() => {
    if (!searchModels || !organizations || !serviceCategories) {
      return [];
    }

    return searchModels.models.map((m) => {
      const contributors: string[] = m.contributor
        .map((c) =>
          getPropertyLanguageVersion({
            data: organizations?.['@graph'].find(
              (o) => o['@id'].replace('urn:uuid:', '') === c
            )?.prefLabel,
            lang: i18n.language,
          })
        )
        .filter((c) => c.length > 0);

      const partOf: string[] = m.isPartOf
        .map((p) =>
          getPropertyLanguageVersion({
            data: serviceCategories?.['@graph'].find((c) => c.identifier === p)
              ?.label,
            lang: i18n.language,
          })
        )
        .filter((p) => p.length > 0);

      return {
        id: m.id,
        contributors: contributors,
        description: getLanguageVersion({
          data: m.comment,
          lang: i18n.language,
        }),
        icon: 'applicationProfile',
        status: m.status,
        partOf: partOf,
        title: getLanguageVersion({
          data: m.label,
          lang: i18n.language,
          appendLocale: true,
        }),
        titleLink: `/model/${m.prefix}`,
        type: t(m.type),
      };
    });
  }, [searchModels, serviceCategories, organizations, i18n.language, t]);

  return (
    <main id="main">
      <Title
        title={t('data-vocabularies')}
        description={t('service-description')}
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
            organizations={organizations}
            serviceCategories={serviceCategories}
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
                organizations={organizations}
                serviceCategories={serviceCategories}
                languages={languages}
              />
            </ModalContent>
          </Modal>
        )}
        <ResultAndStatsWrapper id="search-results">
          <SearchResults
            data={data}
            totalHitCount={searchModels?.totalHitCount}
          />
        </ResultAndStatsWrapper>
      </ResultAndFilterContainer>
    </main>
  );
}
