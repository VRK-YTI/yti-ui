import { useTranslation } from 'next-i18next';
import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  Heading,
  Text,
  VisuallyHidden,
} from 'suomifi-ui-components';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock,
} from '../../common/components/block';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';
import FormattedDate from '../../common/components/formatted-date';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import Separator from '../../common/components/separator';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import DetailsExpander from './details-expander';
import ConceptSidebar from './concept-sidebar';
import {
  Badge,
  BadgeBar,
  HeadingBlock,
  MainContent,
  PageContent,
} from './concept.styles';
import { useStoreDispatch } from '../../store';
import { setAlert } from '../../common/components/alert/alert.slice';
import { Error } from '../../common/interfaces/error.interface';
import { useRouter } from 'next/router';
import { setTitle } from '../../common/components/title/title.slice';
import { getProperty } from '../../common/utils/get-property';

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
  const titleRef = useRef<HTMLHeadingElement>(null);

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
    dispatch(setAlert([terminologyError as Error, conceptError as Error]));
  }, [dispatch, terminologyError, conceptError]);

  useEffect(() => {
    if (concept) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [concept, dispatch, prefLabel]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

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
          <HeadingBlock>
            <Text>
              <PropertyValue
                property={getProperty(
                  'prefLabel',
                  terminology?.references.contributor
                )}
                fallbackLanguage="fi"
              />
            </Text>
            <Heading variant="h1" tabIndex={-1} ref={titleRef}>
              {prefLabel}
            </Heading>
            <BadgeBar>
              <span>{t('heading')}</span> &middot;{' '}
              <span>
                <PropertyValue
                  property={terminology?.properties.prefLabel}
                  fallbackLanguage="fi"
                />
              </span>{' '}
              &middot;{' '}
              <Badge
                isValid={
                  getPropertyValue({ property: concept?.properties.status }) ===
                  'VALID'
                }
              >
                {t(
                  getPropertyValue({ property: concept?.properties.status }) ??
                    '',
                  { ns: 'common' }
                )}
              </Badge>
            </BadgeBar>
          </HeadingBlock>

          <MultilingualPropertyBlock
            title={<h2>{t('field-definition')}</h2>}
            data={concept?.properties.definition}
          />
          <MultilingualPropertyBlock
            title={t('field-example')}
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
            title={t('field-note')}
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
