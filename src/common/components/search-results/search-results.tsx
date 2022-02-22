import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Collection } from '../../interfaces/collection.interface';
import { GroupSearchResult, OrganizationSearchResult, TerminologySearchResult } from '../../interfaces/terminology.interface';
import { VocabularyConcepts } from '../../interfaces/vocabulary.interface';
import PropertyValue from '../property-value';
import { useBreakpoints } from '../media-query/media-query-context';
import SearchCountTags from './search-count-tags';
import {
  Card,
  CardChip,
  CardConcepts,
  CardContributor,
  CardDescription,
  CardInfoDomain,
  CardSubtitle,
  CardTitle,
  CardTitleIcon,
  CardTitleLink,
  CardTitleWrapper,
  CardWrapper
} from './search-results.styles';
import { Concept } from '../../interfaces/concept.interface';
import useUrlState from '../../utils/hooks/useUrlState';
import TextLinks from '../text-links';

interface SearchResultsProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  type?: string;
  organizations?: OrganizationSearchResult[];
  domains?: GroupSearchResult[];
}

export default function SearchResults({ data, type, organizations, domains }: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');
  const { urlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

  if (type === 'terminology-search' && 'terminologies' in data) {
    return (
      renderTerminologiesSearchResults()
    );
  } else if ('concepts' in data) {
    return (
      renderConceptSearchResults()
    );
  } else if (type === 'collections') {
    return (
      renderConceptCollections()
    );
  }

  return <></>;

  function renderTerminologiesSearchResults() {
    if ('terminologies' in data) {
      return (
        <>
          <SearchCountTags
            title={t('terminology-search-terminologies', {
              count: data?.totalHitCount ?? 0,
            })}
            organizations={organizations}
            domains={domains}
            renderQBeforeStatus
          />
          <CardWrapper isSmall={isSmall}>
            {data?.terminologies?.map((terminology, idx: number) => {
              return (
                <Card key={`search-result-${idx}`}>
                  <CardContributor>
                    {terminology.contributors[0].label[i18n.language]
                      ?? terminology.contributors[0].label['fi']
                      ?? ''
                    }
                  </CardContributor>

                  <CardTitleWrapper>
                    <Link passHref href={'/terminology/' + terminology.id}>
                      <CardTitleLink href=''>
                        <CardTitleIcon icon='registers' />
                        <CardTitle variant='h3'>
                          {terminology.label[i18n.language]
                            ?
                            terminology.label[i18n.language].replaceAll(/<\/*[^>]>/g, '')
                            :
                            terminology?.label?.[Object.keys(terminology.label)[0]].replaceAll(/<\/*[^>]>/g, '')
                          }
                        </CardTitle>
                      </CardTitleLink>
                    </Link>
                  </CardTitleWrapper>

                  <CardSubtitle>
                    <span>{t('terminology-search-results-terminology')}</span>
                    <span>&middot;</span>
                    <CardChip valid={terminology.status === 'VALID' ? 'true' : undefined}>
                      {t(terminology.status ?? '')}
                    </CardChip>
                  </CardSubtitle>

                  <CardDescription>
                    {terminology?.description?.[i18n.language] !== undefined
                      ?
                      terminology?.description?.[i18n.language]
                      :
                      terminology?.description?.[Object.keys(terminology?.description)[0]]
                        ?
                        terminology?.description?.[Object.keys(terminology?.description)[0]]
                        :
                        t('terminology-search-no-description')}
                  </CardDescription>

                  <CardInfoDomain>
                    <b>
                      {t('terminology-search-results-information-domains')}:
                    </b>
                    {terminology.informationDomains.map((term, i: number) => {
                      let comma = i !== terminology.informationDomains.length - 1 ? ',' : '';
                      return <span key={`term-label-${term}-${i}`}> {term.label[i18n.language]}{comma}</span>;
                    })}
                  </CardInfoDomain>
                </Card>
              );
            })}
          </CardWrapper>
        </>
      );
    }

    return null;
  }

  function renderConceptSearchResults() {
    if ('concepts' in data) {
      if (data && !Array.isArray(data)) {
        return (
          <>
            <SearchCountTags
              title={t('vocabulary-results-concepts', {
                count: data?.totalHitCount ?? 0,
              })}
              organizations={organizations}
              domains={domains}
            />
            <CardWrapper isSmall={isSmall}>
              {data?.concepts.map((concept, idx) => {
                return (
                  <Card key={`search-result-${idx}`}>
                    <CardTitle variant='h2'>
                      <Link passHref href={`/terminology/${concept.terminology.id}/concept/${concept.id}`}>
                        <CardTitleLink href=''>
                          {concept.label[i18n.language]
                            ?
                            concept.label[i18n.language].replaceAll(/<\/*[^>]>/g, '')
                            :
                            concept?.label?.[Object.keys(concept.label)[0]].replaceAll(/<\/*[^>]>/g, '')
                          }
                        </CardTitleLink>
                      </Link>
                    </CardTitle>

                    <CardSubtitle>
                      {t('vocabulary-info-concept')} &middot; {t(`${concept.status}`)}
                    </CardSubtitle>

                    <CardDescription>
                      {concept.definition?.[i18n.language]
                        ?
                        <TextLinks text={concept.definition?.[i18n.language]} />
                        :
                        concept.definition?.[Object.keys(concept.definition)[0]]
                          ?
                          <TextLinks text={concept?.definition?.[Object.keys(concept?.definition)[0]]} />
                          :
                          t('terminology-search-no-description')
                      }
                    </CardDescription>
                  </Card>
                );
              })}
            </CardWrapper>
          </>
        );
      }
    }

    return null;
  }

  function renderConceptCollections() {
    if (!Array.isArray(data) || data.length < 1) {
      return null;
    }

    return (
      <>
        <SearchCountTags
          title={t('vocabulary-results-collections', {
            count: data.length,
          })}
        />
        <CardWrapper isSmall={isSmall}>
          {data.map((collection, idx: number) => {
            const minId = Math.max(0, (urlState.page - 1) * 10);
            const maxId = minId + 10;
            if (idx >= maxId || idx < minId) {
              return null;
            }

            return (
              <Card key={`search-result-${idx}`}>
                <CardTitle variant='h2'>
                  <Link passHref href={`/terminology/${collection.type.graph.id}/collection/${collection.id}`}>
                    <CardTitleLink href=''>
                      <PropertyValue property={collection.properties.prefLabel} fallbackLanguage='fi' />
                    </CardTitleLink>
                  </Link>
                </CardTitle>

                <CardSubtitle>
                  {t('vocabulary-info-collection')}
                </CardSubtitle>

                <CardDescription>
                  <PropertyValue
                    property={collection.properties.definition}
                    fallbackLanguage='fi'
                    fallback={t('vocabulary-results-no-description')}
                  />
                </CardDescription>

                <CardConcepts value={t('vocabulary-filter-concepts') as string}>
                  {renderCollectionMembers(collection.references?.member)}
                </CardConcepts>
              </Card>
            );
          })}
        </CardWrapper>
      </>
    );
  }

  function renderCollectionMembers(members?: Concept[]) {
    return (
      members
        ?
        members.map((m, idx) => {
          const comma = (idx < 4 && members.length > 1) ? ',' : '';

          if (idx < 5 && m.references.prefLabelXl) {
            if (m.references.prefLabelXl.length === 1) {
              if (m.references.prefLabelXl[0].properties.prefLabel?.[0].lang === i18n.language) {
                const value = m.references.prefLabelXl[0].properties.prefLabel?.[0].value;

                return (
                  <div key={`${value}-${idx}`}>
                    {value}{comma}&nbsp;
                  </div>
                );
              } else {
                const value = m.references.prefLabelXl[0].properties.prefLabel?.[0].value;
                const lang = m.references.prefLabelXl[0].properties.prefLabel?.[0].lang;

                return (
                  <div key={`${value}-${idx}`}>
                    {value} ({lang}){comma}&nbsp;
                  </div>
                );
              }

            } else if (m.references.prefLabelXl.length > 1) {
              let value;

              m.references.prefLabelXl?.forEach(pLabelXl => {
                if (pLabelXl.properties.prefLabel?.[0].lang === i18n.language) {
                  value = pLabelXl.properties.prefLabel?.[0].value;
                }
              });

              if (value !== '') {
                return (
                  <div key={`${value}-${idx}`}>
                    {value}{comma}&nbsp;
                  </div>
                );
              } else {
                value = m.references.prefLabelXl?.[0].properties.prefLabel?.[0].value;
                const lang = m.references.prefLabelXl?.[0].properties.prefLabel?.[0].lang;

                return (
                  <div key={`${value}-${idx}`}>
                    {value} ({lang}){comma}&nbsp;
                  </div>
                );
              }

            }
          } else if (idx === 5) {
            const surplus = members.length - idx;
            return (
              <div key={`surplus-${idx}`}>+ {surplus} {t('vocabulary-results-more')}</div>
            );
          }
        })
        :
        <>{t('vocabulary-results-no-concepts')}</>
    );
  }
}
