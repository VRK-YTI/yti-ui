import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Collection } from '@app/common/interfaces/collection.interface';
import {
  GroupSearchResult,
  OrganizationSearchResult,
  TerminologyDTO,
  TerminologySearchResult,
} from '@app/common/interfaces/terminology.interface';
import {
  VocabularyConceptDTO,
  VocabularyConcepts,
} from '@app/common/interfaces/vocabulary.interface';
import PropertyValue from '@app/common/components/property-value';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
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
  CardWrapper,
} from './search-results.styles';
import { Concept } from '@app/common/interfaces/concept.interface';
import useUrlState from '@app/common/utils/hooks/useUrlState';
import SanitizedTextContent from '@app/common/components/sanitized-text-content';
import { VisuallyHidden } from 'suomifi-ui-components';

interface SearchResultsProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  type?: string;
  organizations?: OrganizationSearchResult[];
  domains?: GroupSearchResult[];
}

export default function SearchResults({
  data,
  type,
  organizations,
  domains,
}: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');
  const { urlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

  if (type === 'terminology-search' && 'terminologies' in data) {
    return renderTerminologiesSearchResults();
  } else if ('concepts' in data) {
    return renderConceptSearchResults();
  } else if (type === 'collections') {
    return renderConceptCollections();
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
            count={data?.totalHitCount}
          />
          <CardWrapper $isSmall={isSmall}>
            {data?.terminologies?.map((terminology) => {
              return (
                <Card key={terminology.id}>
                  <CardContributor>
                    {terminology.contributors[0].label[i18n.language] ??
                      terminology.contributors[0].label['fi'] ??
                      ''}
                  </CardContributor>

                  <CardTitleWrapper>
                    <Link passHref href={'/terminology/' + terminology.id}>
                      <CardTitleLink href="">
                        <CardTitleIcon icon="registers" />
                        <CardTitle>
                          {getLabel(terminology)}
                          <VisuallyHidden>
                            {terminology.contributors[0].label[i18n.language] ??
                              terminology.contributors[0].label['fi'] ??
                              ''}
                          </VisuallyHidden>
                        </CardTitle>
                      </CardTitleLink>
                    </Link>
                  </CardTitleWrapper>

                  <CardSubtitle>
                    <div>{t('terminology-search-results-terminology')}</div>
                    <span aria-hidden="true">&middot;</span>
                    <div>
                      <CardChip
                        valid={
                          terminology.status === 'VALID' ? 'true' : undefined
                        }
                      >
                        {t(terminology.status ?? 'DRAFT')}
                      </CardChip>
                    </div>
                  </CardSubtitle>

                  <CardDescription>
                    {getDescription(terminology)}
                  </CardDescription>

                  <CardInfoDomain>
                    <b>
                      {t('terminology-search-results-information-domains')}:
                    </b>
                    {terminology.informationDomains.map((term, i: number) => {
                      const comma =
                        i !== terminology.informationDomains.length - 1
                          ? ','
                          : '';
                      return (
                        <span key={term.id}>
                          {' '}
                          {term.label[i18n.language]}
                          {comma}
                        </span>
                      );
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
              count={data?.totalHitCount}
            />
            <CardWrapper $isSmall={isSmall}>
              {data?.concepts.map((concept) => {
                return (
                  <Card key={concept.id}>
                    <CardTitle>
                      <Link
                        passHref
                        href={`/terminology/${concept.terminology.id}/concept/${concept.id}`}
                      >
                        <CardTitleLink href="">
                          {getLabel(concept)}
                        </CardTitleLink>
                      </Link>
                    </CardTitle>

                    <CardSubtitle>
                      <div>{t('vocabulary-info-concept')}</div>
                      <span aria-hidden="true">&middot;</span>
                      <div>{t(`${concept.status ?? 'DRAFT'}`)}</div>
                    </CardSubtitle>

                    <CardDescription>{getDefinition(concept)}</CardDescription>
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

  function getLabel(dto: VocabularyConceptDTO | TerminologyDTO) {
    // If language is defined in urlState get label without trailing language code
    if (urlState.lang && dto.label[urlState.lang]) {
      return dto.label[urlState.lang].replaceAll(/<\/*[^>]>/g, '');
    }

    // If label exists in current UI language get label without trailing language code
    if (!urlState.lang && dto.label[i18n.language]) {
      return dto.label[i18n.language].replaceAll(/<\/*[^>]>/g, '');
    }

    // Otherwise return label with trailing language code
    return `${dto?.label?.[Object.keys(dto.label)[0]].replaceAll(
      /<\/*[^>]>/g,
      ''
    )} (${Object.keys(dto.label)[0]})`;
  }

  function getDescription(terminology: TerminologyDTO) {
    if (terminology?.description?.[i18n.language] !== undefined) {
      return terminology?.description?.[i18n.language];
    }

    if (terminology?.description?.[Object.keys(terminology?.description)[0]]) {
      return terminology?.description?.[
        Object.keys(terminology?.description)[0]
      ];
    }

    return t('terminology-search-no-description');
  }

  function getDefinition(concept: VocabularyConceptDTO) {
    if (concept.definition?.[i18n.language]) {
      return (
        <SanitizedTextContent text={concept.definition?.[i18n.language]} />
      );
    }

    if (concept.definition?.[Object.keys(concept.definition)[0]]) {
      return (
        <SanitizedTextContent
          text={concept?.definition?.[Object.keys(concept?.definition)[0]]}
        />
      );
    }

    return t('terminology-search-no-description');
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
          count={data.length}
        />
        <CardWrapper $isSmall={isSmall}>
          {data.map((collection, idx: number) => {
            const minId = Math.max(0, (urlState.page - 1) * 10);
            const maxId = minId + 10;
            if (idx >= maxId || idx < minId) {
              return null;
            }

            return (
              <Card key={collection.id}>
                <CardTitle>
                  <Link
                    passHref
                    href={`/terminology/${collection.type.graph.id}/collection/${collection.id}`}
                  >
                    <CardTitleLink href="">
                      <PropertyValue
                        property={collection.properties.prefLabel}
                        fallbackLanguage="fi"
                      />
                    </CardTitleLink>
                  </Link>
                </CardTitle>

                <CardSubtitle>{t('vocabulary-info-collection')}</CardSubtitle>

                <CardDescription>
                  <PropertyValue
                    property={collection.properties.definition}
                    fallbackLanguage="fi"
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
    return members ? (
      members.map((m, idx) => {
        const comma = idx < 4 && members.length > 1 ? ',' : '';

        if (idx < 5 && m.references.prefLabelXl) {
          if (m.references.prefLabelXl.length === 1) {
            if (
              m.references.prefLabelXl[0].properties.prefLabel?.[0].lang ===
              i18n.language
            ) {
              const value =
                m.references.prefLabelXl[0].properties.prefLabel?.[0].value;

              return (
                <div key={`${value}-${idx}`}>
                  {value}
                  {comma}&nbsp;
                </div>
              );
            } else {
              const value =
                m.references.prefLabelXl[0].properties.prefLabel?.[0].value;
              const lang =
                m.references.prefLabelXl[0].properties.prefLabel?.[0].lang;

              return (
                <div key={`${value}-${idx}`}>
                  {value} ({lang}){comma}&nbsp;
                </div>
              );
            }
          } else if (m.references.prefLabelXl.length > 1) {
            let value;

            m.references.prefLabelXl?.forEach((pLabelXl) => {
              if (pLabelXl.properties.prefLabel?.[0].lang === i18n.language) {
                value = pLabelXl.properties.prefLabel?.[0].value;
              }
            });

            if (value !== '') {
              return (
                <div key={`${value}-${idx}`}>
                  {value}
                  {comma}&nbsp;
                </div>
              );
            } else {
              value =
                m.references.prefLabelXl?.[0].properties.prefLabel?.[0].value;
              const lang =
                m.references.prefLabelXl?.[0].properties.prefLabel?.[0].lang;

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
            <div key={`surplus-${idx}`}>
              + {surplus} {t('vocabulary-results-more')}
            </div>
          );
        }
      })
    ) : (
      <>{t('vocabulary-results-no-concepts')}</>
    );
  }
}
