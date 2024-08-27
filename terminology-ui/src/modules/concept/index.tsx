import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo } from 'react';
import {
  Button,
  ExternalLink,
  IconEdit,
  Notification,
  Paragraph,
  Text,
  VisuallyHidden,
} from 'suomifi-ui-components';
import {
  BasicBlock,
  BasicBlockExtraWrapper,
  MultilingualBlock,
  MultilingualBlockList,
} from 'yti-common-ui/block';
import {
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock,
} from '@app/common/components/block';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import FormattedDate from 'yti-common-ui/formatted-date';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import Separator from 'yti-common-ui/separator';
import DetailsExpander from './details-expander';
import ConceptSidebar from './concept-sidebar';
import {
  EditToolsBlock,
  MainContent,
  PageContent,
  PropertyList,
} from './concept.styles';
import { useStoreDispatch } from '@app/store';
import { useRouter } from 'next/router';
import { setTitle } from '@app/common/components/title/title.slice';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import { getProperty } from '@app/common/utils/get-property';
import { MainTitle, BadgeBar } from 'yti-common-ui/title-block';
import HasPermission from '@app/common/utils/has-permission';
import Link from 'next/link';
import { translateStatus } from '@app/common/utils/translation-helpers';
import isEmail from 'validator/lib/isEmail';
import RemovalModal from '@app/common/components/removal-modal';
import { getBlockData } from './utils';
import { StatusChip } from 'yti-common-ui/status-chip';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { t, i18n } = useTranslation('concept');
  const { breakpoint } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { data: terminology, error: terminologyError } = useGetTerminologyQuery(
    {
      id: terminologyId,
    }
  );
  const hasPermission = HasPermission({
    actions: ['EDIT_CONCEPT', 'DELETE_CONCEPT'],
    targetOrganization: terminology?.organizations,
  });
  const { data: concept, error: conceptError } = useGetConceptQuery({
    terminologyId,
    conceptId,
  });
  const {
    data: organizations,
    isLoading,
    isError,
  } = useGetOrganizationsQuery({
    language: i18n.language,
    showChildOrganizations: true,
  });

  const { terms, definitions, notes, examples } = useMemo(() => {
    return getBlockData(t, concept);
  }, [concept, t]);

  const childOrganizations = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }
    return organizations
      ?.filter((org) => org.parentOrganization)
      .map((org) => org.id);
  }, [organizations, isLoading, isError]);

  const recommendedTerm =
    concept?.recommendedTerms.find((term) => term.language === i18n.language) ??
    concept?.recommendedTerms[0];

  const prefLabel = recommendedTerm?.label ?? '';
  const status = concept?.status || 'DRAFT';
  const email = terminology?.contact?.trim() ?? '';

  useEffect(() => {
    if (concept) {
      dispatch(setTitle(prefLabel));
    }
  }, [concept, dispatch, prefLabel]);

  if (conceptError) {
    return (
      <>
        <Breadcrumb>
          {!terminologyError && (
            <BreadcrumbLink url={`/terminology/${terminologyId}`}>
              {getLanguageVersion({
                data: terminology?.label,
                lang: i18n.language,
              })}
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
            {getLanguageVersion({
              data: terminology?.label,
              lang: i18n.language,
            })}
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
          <MainTitle>{prefLabel}</MainTitle>
          <BadgeBar>
            {t('heading')}
            {getLanguageVersion({
              data: terminology?.label,
              lang: i18n.language,
            })}
            <StatusChip status={status}>
              {translateStatus(status, t)}
            </StatusChip>
          </BadgeBar>
          <BasicBlock title="URI">{concept?.uri}</BasicBlock>

          <TermBlock title={<h2>{t('field-terms-label')}</h2>} data={terms} />

          {Object.keys(definitions).length > 0 && (
            <BasicBlock title={t('field-definition')}>
              <MultilingualBlock data={definitions} renderHtml={true} />
            </BasicBlock>
          )}

          {concept?.subjectArea && (
            <BasicBlock title={t('field-subject-area')}>
              {concept?.subjectArea}
            </BasicBlock>
          )}

          {notes && notes.length > 0 && (
            <BasicBlock title={t('field-note')}>
              <MultilingualBlockList data={notes} renderHtml />
            </BasicBlock>
          )}

          {examples && examples.length > 0 && (
            <BasicBlock title={t('field-example')}>
              <MultilingualBlockList data={examples} renderHtml />
            </BasicBlock>
          )}

          <DetailsExpander concept={concept} />

          <Separator isLarge />
          {hasPermission && (
            <>
              <BasicBlock
                title={t('edit-collection-block-title')}
                extra={
                  <BasicBlockExtraWrapper>
                    <EditToolsBlock>
                      <Link
                        href={`/terminology/${terminologyId}/concept/${conceptId}/edit`}
                      >
                        <Button
                          variant="secondary"
                          icon={<IconEdit />}
                          id="edit-concept-button"
                        >
                          {t('edit-concept')}
                        </Button>
                      </Link>

                      <RemovalModal
                        nonDescriptive={true}
                        dataType="concept"
                        targetId={concept?.identifier ?? ''}
                        targetName={prefLabel}
                        targetPrefix={terminology?.prefix}
                      />
                    </EditToolsBlock>
                  </BasicBlockExtraWrapper>
                }
              />
              <Separator isLarge />
            </>
          )}
          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>
          <BasicBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            id="organization"
          >
            <PropertyList $smBot={true}>
              {terminology?.organizations
                ?.filter(
                  (o) => o && o.label && !childOrganizations?.includes(o.id)
                )
                .map((organization) => (
                  <li key={organization.id}>
                    {organization?.label[i18n.language]}
                  </li>
                ))}
            </PropertyList>
          </BasicBlock>
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={concept?.created} />
            {concept?.creator.name && `, ${concept.creator.name}`}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={concept?.modified} />
            {concept?.modifier.name && `, ${concept.modifier.name}`}
          </BasicBlock>
          <Separator isLarge />
          <BasicBlock
            extra={
              <ExternalLink
                href={`mailto:${
                  isEmail(email) ? email : 'yhteentoimivuus@dvv.fi'
                }?subject=${t('feedback-concept', {
                  ns: 'common',
                })} - ${prefLabel}`}
                labelNewWindow={`${t('site-open-new-email', {
                  ns: 'common',
                })} ${isEmail(email) ? email : 'yhteentoimivuus@dvv.fi'}`}
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
