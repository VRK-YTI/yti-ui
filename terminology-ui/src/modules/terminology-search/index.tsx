import {
  useGetGroupsQuery,
  useGetSearchResultQuery,
  useGetOrganizationsQuery,
} from '@app/common/components/terminology-search/terminology-search.slice';
import Title from 'yti-common-ui/title';
import {
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
  FilterMobileButton,
} from './terminology-search.styles';
import SearchResults, {
  SearchResultData,
} from 'yti-common-ui/search-results/search-results';
import Pagination from 'yti-common-ui/pagination';
import { useTranslation } from 'next-i18next';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  IconRegisters,
  Modal,
  ModalContent,
  Paragraph,
  Link as SuomiFiLink,
} from 'suomifi-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useGetCountsQuery } from '@app/common/components/counts/counts.slice';
import { SearchPageFilter } from './search-page-filter';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import {
  selectAlert,
  setAlert,
} from '@app/common/components/alert/alert.slice';
import LoadIndicator from 'yti-common-ui/load-indicator';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { translateTerminologyType } from '@app/common/utils/translation-helpers';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import NewTerminology from '@app/modules/new-terminology';
import { setTitle } from '@app/common/components/title/title.slice';
import Link from 'next/link';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export default function TerminologySearch() {
  const { t, i18n } = useTranslation();
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data, error, isFetching, refetch } = useGetSearchResultQuery({
    urlState,
    language: i18n.language,
  });
  const { data: groupsData, error: groupsError } = useGetGroupsQuery(
    i18n.language
  );
  const { data: orgsData, error: organizationsError } =
    useGetOrganizationsQuery({
      language: i18n.language,
      showChildOrganizations: false,
    });
  const { data: counts, error: countsError } = useGetCountsQuery(null);
  const dispatch = useStoreDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const previousAlerts = useSelector(selectAlert());

  const organizations = useMemo(() => {
    if (!orgsData) {
      return [];
    }

    return orgsData.map((o) => ({
      id: o.id,
      label: getLanguageVersion({ data: o.label, lang: i18n.language }),
    }));
  }, [orgsData]);

  const groups = useMemo(() => {
    if (!groupsData) {
      return [];
    }

    return groupsData.map((g) => ({
      id: g.identifier,
      label: getLanguageVersion({ data: g.label, lang: i18n.language }),
    }));
  }, [groupsData]);

  const results: SearchResultData[] = useMemo(() => {
    if (!data || !data.responseObjects) {
      return [];
    }

    return data.responseObjects.map((terminology) => ({
      id: terminology.prefix,
      contributors: terminology.organizations.map(
        (c) => organizations.find((o) => o.id === c)?.label ?? ''
      ),
      description: getLanguageVersion({
        data: terminology.description,
        lang: i18n.language,
      }),
      icon: <IconRegisters />,
      status: terminology.status,
      partOf: terminology.groups.map(
        (d) => groups.find((g) => g.id === d)?.label ?? ''
      ),
      title: getLanguageVersion({
        data: terminology.label,
        lang: i18n.language,
      }),
      titleLink: `terminology/${terminology.prefix}`,
      type: translateTerminologyType(terminology.type, t),
    }));
  }, [data, t, i18n.language]);

  const extra = useMemo(() => {
    return (
      data?.responseObjects.reduce((deepHitsResult, object) => {
        const concepts = object.matchingConcepts.map((concept) => {
          return {
            label: getLanguageVersion({
              data: concept.label,
              lang: i18n.language,
            }),
            id: concept.identifier,
            uri: `/terminology/${object.prefix}/concept/${concept.identifier}`,
          };
        });
        if (concepts.length > 0) {
          deepHitsResult[object.prefix] = concepts;
        }
        return deepHitsResult;
      }, {} as { [key: string]: { label: string; id: string; uri: string }[] }) ??
      {}
    );
  }, [data, i18n.language]);

  useEffect(() => {
    dispatch(
      setAlert(
        [
          {
            note: error,
            displayText: t('error-occured_terminology-search', { ns: 'alert' }),
          },
          {
            note: groupsError,
            displayText: t('error-occured_groups', { ns: 'alert' }),
          },
          {
            note: organizationsError,
            displayText: t('error-occured_organization', { ns: 'alert' }),
          },
          {
            note: countsError,
            displayText: t('error-occured_counts', { ns: 'alert' }),
          },
        ],
        previousAlerts
      )
    );
  }, [
    dispatch,
    error,
    groupsError,
    organizationsError,
    countsError,
    previousAlerts,
    t,
  ]);

  useEffect(() => {
    dispatch(setTitle(t('terminology-title')));
  }, [dispatch, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(isFetching);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isFetching, setShowLoading]);

  return (
    <main id="main">
      <Title
        title={t('terminology-title')}
        noBreadcrumbs={true}
        extra={
          <TitleDescriptionWrapper $isSmall={isSmall}>
            <Description id="page-description">
              {t('terminology-search-info')}
            </Description>
            <NewTerminology />
          </TitleDescriptionWrapper>
        }
      />

      {isSmall && groupsData && orgsData && (
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
          <SearchPageFilter
            organizations={orgsData}
            groups={groupsData}
            counts={counts}
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
              <SearchPageFilter
                isModal
                onModalClose={() => setShowModal(false)}
                resultCount={data?.totalHitCount}
                organizations={orgsData}
                groups={groupsData}
                counts={counts}
              />
            </ModalContent>
          </Modal>
        )}
        <ResultAndStatsWrapper id="search-results">
          {(showLoading && isFetching) || error ? (
            <LoadIndicator
              isFetching={isFetching}
              error={error}
              refetch={refetch}
            />
          ) : (
            data && (
              <>
                <SearchResults
                  data={results}
                  domains={groups}
                  organizations={organizations}
                  partOfText={t(
                    'terminology-search-results-information-domains'
                  )}
                  noDescriptionText={t('vocabulary-results-no-description')}
                  noVersion
                  tagsTitle={t('terminology-search-terminologies', {
                    count: data?.totalHitCount ?? 0,
                  })}
                  tagsHiddenTitle={t('search-results-count', {
                    count: data?.totalHitCount ?? 0,
                  })}
                  extra={{
                    expander: {
                      buttonLabel: t('results-with-query-from-terminology'),
                      contentLabel: t('concepts'),
                      deepHits: extra,
                    },
                  }}
                />
                <Pagination maxPages={Math.ceil(data.totalHitCount / 50)} />
              </>
            )
          )}
        </ResultAndStatsWrapper>
      </ResultAndFilterContainer>
    </main>
  );
}
