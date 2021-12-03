import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import SearchCountTags from './search-count-tags';
import {
  Card,
  CardContributor,
  CardDescription,
  CardInfoDomain,
  CardPill,
  CardSubtitle,
  CardTitle,
  CardTitleIcon,
  CardTitleLink,
  CardWrapper
} from './search-results.styles';

interface SearchResultsProps {
  data: any;
  filter: any;
  type?: any;
  setSomeFilter: any;
}

export default function SearchResults({ data, filter, type, setSomeFilter }: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');

  if (type === 'terminology-search') {
    return (
      <>
        <SearchCountTags count={data?.totalHitCount} filter={filter} setFilter={setSomeFilter} />
        <CardWrapper>
          {data?.terminologies.map((terminology: any, idx: number) => {
            return (
              <Card key={`search-result-${idx}`}>
                <CardContributor>
                  {terminology.contributors[0].label[i18n.language]}
                </CardContributor>

                <CardTitle variant='h2'>
                  <Link passHref href={'/terminology/' + terminology.id}>
                    <CardTitleLink href=''>
                      <CardTitleIcon icon='registers' />
                      <span dangerouslySetInnerHTML={{
                        __html: terminology.label[i18n.language] !== undefined
                          ?
                          terminology.label[i18n.language]
                          :
                          terminology?.label?.[Object.keys(terminology.label)[0]]
                      }}
                      className='label'
                      />
                    </CardTitleLink>
                  </Link>
                </CardTitle>

                <CardSubtitle>
                  {t('terminology-search-results-terminology').toUpperCase()} &middot; <CardPill valid={terminology.status === 'VALID' ? 'true' : undefined}>{t(terminology.status)}</CardPill>
                </CardSubtitle>

                <CardDescription>
                  {terminology?.description?.[i18n.language] !== undefined ? terminology?.description?.[i18n.language] : terminology?.description?.[Object.keys(terminology?.description)[0]]}
                </CardDescription>

                <CardInfoDomain>
                  <b>
                    {t('terminology-search-results-information-domains')}:
                  </b>
                  {terminology.informationDomains.map((term: any, i: number) => {
                    if (i !== terminology.informationDomains.length - 1) {
                      return <span key={`term-label-${term}-${i}`}> {term.label[i18n.language]},</span>;
                    } else {
                      return <span key={`term-label-${term}-${i}`}> {term.label[i18n.language]}</span>;
                    }
                  })}
                </CardInfoDomain>
              </Card>
            );
          })}
        </CardWrapper>
      </>
    );
  } else {
    return (
      <>
        <SearchCountTags count={data?.totalHitCount} filter={filter} setFilter={setSomeFilter} />
        <CardWrapper>
          {data?.concepts.map((concept: any, idx: number) => {
            return (
              <Card key={`search-result-${idx}`}>
                <CardTitle variant='h2'>
                  {concept.label[i18n.language] !== undefined ? concept.label[i18n.language] : concept?.label?.[Object.keys(concept.label)[0]]}
                </CardTitle>

                <CardSubtitle>
                  {t('vocabulary-info-concept').toUpperCase()} &middot; {t(`${concept.status}`).toUpperCase()} {type !== undefined && <>&middot; <CardPill>LUONNOS</CardPill></>}
                </CardSubtitle>

                <CardDescription>
                  {concept?.definition?.[i18n.language] !== undefined ? concept?.definition?.[i18n.language] : concept?.definition?.[Object.keys(concept?.definition)[0]]}
                </CardDescription>
              </Card>
            );
          })}
        </CardWrapper>
      </>
    );
  }
}
