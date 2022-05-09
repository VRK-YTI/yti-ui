import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { ExternalLink, VisuallyHidden } from 'suomifi-ui-components';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock,
} from '@app/common/components/block';
import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import FormattedDate from '@app/common/components/formatted-date';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import PropertyValue from '@app/common/components/property-value';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import Separator from '@app/common/components/separator';
import DetailsExpander from './details-expander';
import ConceptSidebar from './concept-sidebar';
import { MainContent, PageContent } from './concept.styles';
import { useStoreDispatch } from '@app/store';
import { setAlert } from '@app/common/components/alert/alert.slice';
import { useRouter } from 'next/router';
import { setTitle } from '@app/common/components/title/title.slice';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import { getProperty } from '@app/common/utils/get-property';
import {
  SubTitle,
  MainTitle,
  BadgeBar,
  Badge,
} from '@app/common/components/title-block';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
  setConceptTitle: (title?: string) => void;
}

export default function Concept({
  terminologyId,
  conceptId,
  setConceptTitle,
}: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology, error: terminologyError } =
    useGetVocabularyQuery(terminologyId);
  const { data: concept, error: conceptError } = useGetConceptQuery({
    terminologyId,
    conceptId,
  });
  const { t, i18n } = useTranslation('concept');
  const dispatch = useStoreDispatch();
  const router = useRouter();

  if (conceptError && 'status' in conceptError && conceptError.status === 404) {
    router.push('/404');
  }

  const prefLabel = getPropertyValue({
    property: getProperty('prefLabel', concept?.references.prefLabelXl),
    language: i18n.language,
    fallbackLanguage: 'fi',
  });

  useEffect(() => {
    setConceptTitle(prefLabel);
  }, [setConceptTitle, prefLabel]);

  useEffect(() => {
    dispatch(setAlert([terminologyError, conceptError], []));
  }, [dispatch, terminologyError, conceptError]);

  useEffect(() => {
    if (concept) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [concept, dispatch, prefLabel]);

  const status = getPropertyValue({ property: concept?.properties.status });

  return (
    <>
      <Breadcrumb>
        {!terminologyError && (
          <BreadcrumbLink url={`/terminology/${terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
        {!conceptError && (
          <BreadcrumbLink
            url={`/terminology/${terminologyId}/concepts/${conceptId}`}
            current
          >
            {prefLabel}
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent id="main">
          <SubTitle>
            <PropertyValue
              property={getProperty(
                'prefLabel',
                terminology?.references.contributor
              )}
              fallbackLanguage="fi"
            />
          </SubTitle>
          <MainTitle>{prefLabel}</MainTitle>
          <BadgeBar>
            {t('heading')}
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
            <Badge isValid={status === 'VALID'}>
              {t(status, { ns: 'common' })}
            </Badge>
          </BadgeBar>

          <MultilingualPropertyBlock
            title={<h2>{t('field-definition')}</h2>}
            data={concept?.properties.definition}
          />
          <MultilingualPropertyBlock
            title={<h2>{t('field-example')}</h2>}
            data={concept?.properties.example}
          />
          <TermBlock
            title={<h2>{t('field-terms-label')}</h2>}
            data={[
              ...(concept?.references.prefLabelXl ?? []).map((term) => ({
                term,
                type: t('field-terms-preferred'),
              })),
              ...(concept?.references.altLabelXl ?? []).map((term) => ({
                term,
                type: t('field-terms-alternative'),
              })),
              ...(concept?.references.notRecommendedSynonym ?? []).map(
                (term) => ({ term, type: t('field-terms-non-recommended') })
              ),
              ...(concept?.references.searchTerm ?? []).map((term) => ({
                term,
                type: t('field-terms-search-term'),
              })),
              ...(concept?.references.hiddenTerm ?? []).map((term) => ({
                term,
                type: t('field-terms-hidden'),
              })),
            ]}
          />

          <MultilingualPropertyBlock
            title={<h2>{t('field-note')}</h2>}
            data={concept?.properties.note}
          />

          <DetailsExpander concept={concept} />

          <Separator isLarge />

          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={
              terminology?.references.contributor?.[0]?.properties.prefLabel
            }
            fallbackLanguage="fi"
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={concept?.createdDate} />, {concept?.createdBy}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={concept?.lastModifiedDate} />,{' '}
            {concept?.lastModifiedBy}
          </BasicBlock>
          <BasicBlock title="URI">{concept?.uri}</BasicBlock>

          <Separator isLarge />

          <BasicBlock
            extra={
              <ExternalLink
                href={`mailto:${getPropertyValue({
                  property: terminology?.properties.contact,
                })}?subject=${conceptId}`}
                labelNewWindow={t('site-open-link-new-window', {
                  ns: 'common',
                })}
              >
                {t('feedback-action')}
              </ExternalLink>
            }
          >
            {t('feedback-label')}
          </BasicBlock>
        </MainContent>
        <ConceptSidebar concept={concept} />
      </PageContent>
    </>
  );
}
