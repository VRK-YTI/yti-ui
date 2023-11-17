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
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import {
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock,
} from '@app/common/components/block';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import FormattedDate from 'yti-common-ui/formatted-date';
import { useBreakpoints } from 'yti-common-ui/media-query';
import PropertyValue from '@app/common/components/property-value';
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
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
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

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { t, i18n } = useTranslation('concept');
  const { breakpoint } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { data: terminology, error: terminologyError } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const hasPermission = HasPermission({
    actions: ['EDIT_CONCEPT', 'DELETE_CONCEPT'],
    targetOrganization: terminology?.references.contributor,
  });
  const { data: concept, error: conceptError } = useGetConceptQuery({
    terminologyId,
    conceptId,
  });

  const { terms, definitions, notes, examples } = useMemo(() => {
    return getBlockData(t, concept);
  }, [concept, t]);

  const prefLabel = getPropertyValue({
    property: getProperty('prefLabel', concept?.references.prefLabelXl),
    language: i18n.language,
  });

  const status =
    getPropertyValue({ property: concept?.properties.status }) || 'DRAFT';
  const email = getPropertyValue({
    property: terminology?.properties.contact,
  }).trim();

  useEffect(() => {
    if (concept) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [concept, dispatch, prefLabel]);

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
          <MainTitle>{prefLabel}</MainTitle>
          <BadgeBar>
            {t('heading')}
            <PropertyValue property={terminology?.properties.prefLabel} />
            <StatusChip status={status}>
              {translateStatus(status, t)}
            </StatusChip>
          </BadgeBar>

          <TermBlock title={<h2>{t('field-terms-label')}</h2>} data={terms} />

          <MultilingualPropertyBlock
            title={<h2>{t('field-definition')}</h2>}
            data={definitions}
          />

          <PropertyBlock
            title={t('field-subject-area')}
            property={concept?.properties.subjectArea}
          />

          <MultilingualPropertyBlock
            title={<h2>{t('field-note')}</h2>}
            data={notes}
          />

          <MultilingualPropertyBlock
            title={<h2>{t('field-example')}</h2>}
            data={examples}
          />

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
                        removalData={{ type: 'concept', data: concept }}
                        targetId={concept?.id ?? ''}
                        targetName={prefLabel}
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
              {terminology?.references.contributor
                ?.filter((c) => c && c.properties.prefLabel)
                .map((contributor) => (
                  <li key={contributor.id}>
                    <PropertyValue
                      property={contributor?.properties.prefLabel}
                    />
                  </li>
                ))}
            </PropertyList>
          </BasicBlock>

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
