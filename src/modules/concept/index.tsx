import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  ExternalLink,
  Heading,
  Text
} from 'suomifi-ui-components';
import { BasicBlock, PropertyBlock, TermBlock } from '../../common/components/block';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import Separator from '../../common/components/separator';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import FormatISODate from '../../common/utils/format-iso-date';
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
  const { t, i18n } = useTranslation('concept');

  return (
    <>
      <PageContent breakpoint={breakpoint}>
        <MainContent>
          <HeadingBlock>
            <Text>
              <PropertyValue
                property={terminology?.references.contributor?.[0].properties.prefLabel}
              />
            </Text>
            <Heading variant="h1">
              <PropertyValue
                property={concept?.references.prefLabelXl?.[0].properties.prefLabel}
              />
            </Heading>
            <BadgeBar>
              <span>{t('heading')}</span>
              {' '}&middot;{' '}
              <span><PropertyValue property={terminology?.properties.prefLabel} /></span>
              {' '}&middot;{' '}
              <Badge
                isValid={getPropertyValue({ property: terminology?.properties.status }) === 'VALID'}
              >
                {t(getPropertyValue({ property: terminology?.properties.status }) ?? '', { ns: 'common' })}
              </Badge>
            </BadgeBar>
          </HeadingBlock>

          <PropertyBlock
            title={t('field-definition')}
            data={concept?.properties.definition}
          />
          <PropertyBlock
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
          <PropertyBlock
            title={t('field-note')}
            data={concept?.properties.note}
          />

          <Separator large />

          <BasicBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            data={getPropertyValue({
              property: terminology?.references.contributor?.[0]?.properties.prefLabel,
              language: i18n.language,
              fallbackLanguage: 'fi',
            })}
          />
          <BasicBlock
            title={t('vocabulary-info-created-at', { ns: 'common' })}
            data={`${FormatISODate(concept?.createdDate)}, ${concept?.createdBy}`}
          />
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
            data={`${FormatISODate(concept?.lastModifiedDate)}, ${concept?.lastModifiedBy}`}
          />
          <BasicBlock
            title={'URI'}
            data={concept?.uri}
          />

          <Separator large />

          <BasicBlock
            data={t('feedback-label')}
            extra={
              <ExternalLink
                href={`mailto:${getPropertyValue({ property: terminology?.properties.contact })}?subject=${conceptId}`}
                labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
              >
                {t('feedback-action')}
              </ExternalLink>
            }
          />
        </MainContent>
        <ConceptSidebar concept={concept} />
      </PageContent>
    </>
  );
};
