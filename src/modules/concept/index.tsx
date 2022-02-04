import { useTranslation } from 'next-i18next';
import React from 'react';
import { ExternalLink, Heading, Text } from 'suomifi-ui-components';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock
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
  PageContent
} from './concept.styles';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: concept } = useGetConceptQuery({ terminologyId, conceptId });
  const { t } = useTranslation('concept');

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${terminologyId}`}>
          <PropertyValue property={terminology?.properties.prefLabel} />
        </BreadcrumbLink>
        <BreadcrumbLink url={`/terminology/${terminologyId}/concepts/${conceptId}`} current>
          <PropertyValue
            property={concept?.references.prefLabelXl?.[0].properties.prefLabel}
            fallbackLanguage='fi'
          />
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent>
          <HeadingBlock>
            <Text>
              <PropertyValue
                property={terminology?.references.contributor?.[0].properties.prefLabel}
                fallbackLanguage='fi'
              />
            </Text>
            <Heading variant="h1">
              <PropertyValue
                property={concept?.references.prefLabelXl?.[0].properties.prefLabel}
                fallbackLanguage='fi'
              />
            </Heading>
            <BadgeBar>
              <span>{t('heading')}</span>
              {' '}&middot;{' '}
              <span><PropertyValue property={terminology?.properties.prefLabel} /></span>
              {' '}&middot;{' '}
              <Badge
                isValid={getPropertyValue({ property: concept?.properties.status }) === 'VALID'}
              >
                {t(getPropertyValue({ property: concept?.properties.status }) ?? '', { ns: 'common' })}
              </Badge>
            </BadgeBar>
          </HeadingBlock>

          <MultilingualPropertyBlock
            title={t('field-definition')}
            data={concept?.properties.definition}
          />
          <MultilingualPropertyBlock
            title={t('field-example')}
            data={concept?.properties.example}
          />
          <TermBlock
            title={t('field-terms-label')}
            data={[
              ...(concept?.references.prefLabelXl ?? []).map(term => ({ term, type: t('field-terms-preferred') })),
              ...(concept?.references.altLabelXl ?? []).map(term => ({ term, type: t('field-terms-alternative') })),
              ...(concept?.references.notRecommendedSynonym ?? []).map(term => ({ term, type: t('field-terms-non-recommended') })),
              ...(concept?.references.searchTerm ?? []).map(term => ({ term, type: t('field-terms-search-term') })),
              ...(concept?.references.hiddenTerm ?? []).map(term => ({ term, type: t('field-terms-hidden') })),
            ]}
          />
          <MultilingualPropertyBlock
            title={t('field-note')}
            data={concept?.properties.note}
          />

          <DetailsExpander concept={concept} />

          <Separator large />

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={terminology?.references.contributor?.[0]?.properties.prefLabel}
            fallbackLanguage="fi"
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={concept?.createdDate} />, {concept?.createdBy}
          </BasicBlock>
          <BasicBlock title={t('vocabulary-info-modified-at', { ns: 'common' })}>
            <FormattedDate date={concept?.lastModifiedDate} />, {concept?.lastModifiedBy}
          </BasicBlock>
          <BasicBlock title="URI">
            {concept?.uri}
          </BasicBlock>

          <Separator large />

          <BasicBlock
            extra={
              <ExternalLink
                href={`mailto:${getPropertyValue({ property: terminology?.properties.contact })}?subject=${conceptId}`}
                labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
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
};
