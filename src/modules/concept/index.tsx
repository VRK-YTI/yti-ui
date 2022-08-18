import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import {
  Button,
  ExternalLink,
  Notification,
  Paragraph,
  Text,
  VisuallyHidden,
} from 'suomifi-ui-components';
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
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import HasPermission from '@app/common/utils/has-permission';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Link from 'next/link';
import { translateStatus } from '@app/common/utils/translation-helpers';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology, error: terminologyError } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const {
    data: concept,
    error: conceptError,
    refetch,
  } = useGetConceptQuery({
    terminologyId,
    conceptId,
  });
  const { t, i18n } = useTranslation('concept');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const loginInformation = useSelector(selectLogin());

  const prefLabel = getPropertyValue({
    property: getProperty('prefLabel', concept?.references.prefLabelXl),
    language: i18n.language,
  });

  useEffect(() => {
    if (concept) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [concept, dispatch, prefLabel]);

  useEffect(() => {
    if (!loginInformation.anonymous) {
      refetch();
    }
  }, [loginInformation, refetch]);

  const status =
    getPropertyValue({ property: concept?.properties.status }) || 'DRAFT';

  if (conceptError) {
    return (
      <>
        <Breadcrumb>
          {!terminologyError && (
            <BreadcrumbLink url={`/terminology/${terminologyId}`}>
              <PropertyValue property={terminology?.properties.prefLabel} />
            </BreadcrumbLink>
          )}
          <BreadcrumbLink url="" current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>

        <main id="main">
          <Notification
            closeText={t('close')}
            status="error"
            headingText={t('error-not-found', {
              context: 'concept',
              ns: 'common',
            })}
            onCloseButtonClick={() =>
              router.push(
                !terminologyError ? `/terminology/${terminologyId}` : '/'
              )
            }
          >
            <Paragraph>
              <Text smallScreen>
                {t('error-not-found-desc', {
                  context: 'concept',
                  ns: 'common',
                })}
              </Text>
            </Paragraph>
          </Notification>
        </main>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        {!terminologyError && (
          <BreadcrumbLink url={`/terminology/${terminologyId}`}>
            <PropertyValue property={terminology?.properties.prefLabel} />
          </BreadcrumbLink>
        )}
        <BreadcrumbLink
          url={`/terminology/${terminologyId}/concepts/${conceptId}`}
          current
        >
          {prefLabel}
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent $breakpoint={breakpoint}>
        <MainContent id="main">
          <SubTitle>
            <PropertyValue
              property={getProperty(
                'prefLabel',
                terminology?.references.contributor
              )}
            />
          </SubTitle>
          <MainTitle>{prefLabel}</MainTitle>
          <BadgeBar>
            {t('heading')}
            <PropertyValue property={terminology?.properties.prefLabel} />
            <Badge $isValid={status === 'VALID'}>
              {translateStatus(status, t)}
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
          <MultilingualPropertyBlock
            title={<h2>{t('subject', { ns: 'admin' })}</h2>}
            data={concept?.properties.subjectArea?.map((s) => ({
              ...s,
              lang: terminology?.properties.language
                ?.map((l) => l.value)
                .includes('fi')
                ? 'fi'
                : terminology?.properties.language?.map((l) => l.value)[0] ??
                  'fi',
            }))}
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

          {HasPermission({
            actions: 'EDIT_CONCEPT',
            targetOrganization: terminologyId,
          }) && (
            <>
              <BasicBlock
                title={t('edit-concept')}
                extra={
                  <BasicBlockExtraWrapper>
                    <Link
                      href={`/terminology/${terminologyId}/concept/${conceptId}/edit`}
                    >
                      <Button
                        variant="secondary"
                        icon="edit"
                        id="edit-concept-button"
                      >
                        {t('edit-concept')}
                      </Button>
                    </Link>
                  </BasicBlockExtraWrapper>
                }
              >
                {t('edit-concept-rights')}
              </BasicBlock>
              <Separator />
            </>
          )}

          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={
              terminology?.references.contributor?.[0]?.properties.prefLabel
            }
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={concept?.createdDate} />
            {concept?.createdBy && `, ${concept.createdBy}`}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={concept?.lastModifiedDate} />
            {concept?.lastModifiedBy && `, ${concept.lastModifiedBy}`}
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
