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
import getPrefLabel from '@app/common/utils/get-preflabel';
import { translateTerminologyType } from '@app/common/utils/translation-helpers';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import NewTerminology from '@app/modules/new-terminology';
import { setTitle } from '@app/common/components/title/title.slice';
import Link from 'next/link';

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
    useGetOrganizationsQuery(i18n.language);
  const { data: counts, error: countsError } = useGetCountsQuery(null);
  const dispatch = useStoreDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const previousAlerts = useSelector(selectAlert());

  const results: SearchResultData[] = useMemo(() => {
    if (!data || !data.terminologies) {
      return [];
    }

    return data.terminologies.map((terminology) => ({
      id: terminology.id,
      contributors: terminology.contributors.map((c) =>
        getPrefLabel({ prefLabels: c.label, lang: i18n.language })
      ),
      description: terminology.description
        ? getPrefLabel({
            prefLabels: terminology.description,
            lang: i18n.language,
          })
        : '',
      icon: <IconRegisters />,
      status: terminology.status,
      partOf: terminology.informationDomains.map((d) =>
        getPrefLabel({ prefLabels: d.label, lang: i18n.language })
      ),
      title: getPrefLabel({
        prefLabels: terminology.label,
        lang: i18n.language,
      }),
      titleLink: `terminology/${terminology.id}`,
      type: translateTerminologyType(terminology.type ?? '', t),
    }));
  }, [data, t, i18n.language]);

  const deepHits = useMemo(() => {
    if (!data || !data.deepHits) {
      return {};
    }

    const keys = Object.keys(data.deepHits);
    const returnValue: {
      [key: string]: { label: string; id: string; uri: string }[];
    } = {};

    keys.forEach((key) => {
      returnValue[key] = data.deepHits[key][0].topHits.map((hit) => ({
        label: getPrefLabel({ prefLabels: hit.label, lang: i18n.language }),
        id: hit.id,
        uri: `terminology/${key}/concept/${hit.id}`,
      }));
    });

    return returnValue;
  }, [data, i18n.language]);

  const organizations = useMemo(() => {
    if (!orgsData) {
      return [];
    }

    return orgsData.map((o) => ({
      id: o.id,
      label: o.properties.prefLabel.value,
    }));
  }, [orgsData]);

  const groups = useMemo(() => {
    if (!groupsData) {
      return [];
    }

    return groupsData.map((g) => ({
      id: g.id,
      label: g.properties.prefLabel.value,
    }));
  }, [groupsData]);

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
          <>
            <TitleDescriptionWrapper $isSmall={isSmall}>
              <Description id="page-description">
                {t('terminology-search-info')}
              </Description>
              <NewTerminology />
            </TitleDescriptionWrapper>
            <Paragraph>
              {t('move-to-former')}{' '}
              <Link
                href="https://sanastot.beta.yti.cloud.dvv.fi/"
                passHref
                legacyBehavior
              >
                <SuomiFiLink href="">{t('to-terminology-tool')}</SuomiFiLink>
              </Link>
              .
            </Paragraph>
          </>
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
                      deepHits,
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
