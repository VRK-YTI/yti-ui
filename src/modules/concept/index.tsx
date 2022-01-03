import { useTranslation } from 'next-i18next';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  Expander,
  ExpanderContent,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Heading,
  Text
} from 'suomifi-ui-components';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
  TermBlock
} from '../../common/components/block';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
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
  setConceptTitle: Dispatch<SetStateAction<string>>;
}

export default function Concept({ terminologyId, conceptId, setConceptTitle }: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: concept } = useGetConceptQuery({ terminologyId, conceptId });
  const { t, i18n } = useTranslation('concept');

  useEffect(() => {
    const title = getPropertyValue({
      property: concept?.references.prefLabelXl?.[0].properties.prefLabel,
      language: i18n.language
    });
    setConceptTitle(title ? title : '');
  }, [concept]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url="/search?page=1">
          {t('terminology-title', { ns: 'common' })}
        </BreadcrumbLink>
        <BreadcrumbLink url={`/terminology/${terminologyId}`}>
          <PropertyValue property={terminology?.properties.prefLabel} />
        </BreadcrumbLink>
        <BreadcrumbLink url={`/terminology/${terminologyId}/concepts/${conceptId}`} current>
          <PropertyValue property={concept?.references.prefLabelXl?.[0].properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

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

          <BasicBlock>
            <ExpanderGroup openAllText="" closeAllText="" toggleAllButtonProps={{ style: { display: 'none' } }}>
              <Expander>
                <ExpanderTitleButton>{t('section-concept-diagrams-and-sources')}</ExpanderTitleButton>
                <ExpanderContent>
                  <PropertyBlock
                    title={t('field-concept-diagrams')}
                    property={undefined}
                    fallbackLanguage="fi"
                  />
                  <PropertyBlock
                    title={t('field-sources')}
                    property={concept?.properties.source}
                    fallbackLanguage="fi"
                  />
                </ExpanderContent>
              </Expander>
              <Expander>
                <ExpanderTitleButton>{t('section-administrative-details')}</ExpanderTitleButton>
                <ExpanderContent>
                  <PropertyBlock
                    title={t('field-change-note')}
                    property={concept?.properties.changeNote}
                    fallbackLanguage="fi"
                  />
                  <PropertyBlock
                    title={t('field-history-note')}
                    property={concept?.properties.historyNote}
                    fallbackLanguage="fi"
                  />
                  <PropertyBlock
                    title={t('field-editorial-note')}
                    property={concept?.properties.editorialNote}
                    fallbackLanguage="fi"
                  />
                  <PropertyBlock
                    title={t('field-notation')}
                    property={concept?.properties.notation}
                    fallbackLanguage="fi"
                  />
                </ExpanderContent>
              </Expander>
              <Expander>
                <ExpanderTitleButton>{t('section-other-details')}</ExpanderTitleButton>
                <ExpanderContent>
                  {/* <MultilingualPropertyBlock
                    title="Aihealue"
                    data={concept?.properties.something}
                  /> */}
                  <PropertyBlock
                    title={t('field-concept-class')}
                    property={concept?.properties.conceptClass}
                  />
                  <PropertyBlock
                    title={t('field-word-class')}
                    property={concept?.properties.wordClass}
                  />
                </ExpanderContent>
              </Expander>
            </ExpanderGroup>
          </BasicBlock>

          <Separator large />

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={terminology?.references.contributor?.[0]?.properties.prefLabel}
            fallbackLanguage="fi"
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            {FormatISODate(concept?.createdDate)}, {concept?.createdBy}
          </BasicBlock>
          <BasicBlock title={t('vocabulary-info-modified-at', { ns: 'common' })}>
            {FormatISODate(concept?.lastModifiedDate)}, {concept?.lastModifiedBy}
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
