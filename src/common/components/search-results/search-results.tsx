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
  CardWrapper
} from './search-results.styles';

interface SearchResultsProps {
  data: any;
  filter: any;
  info?: any;
  setSomeFilter: any;
}

export default function SearchResults({ data, filter, info, setSomeFilter }: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');

  return (
    <>
      <SearchCountTags count={data?.totalHitCount} filter={filter} setFilter={setSomeFilter} />
      <CardWrapper>
        {data?.concepts.map((concept: any, idx: number) => {
          return (
            <Card key={`search-result-${idx}`}>
              {info !== undefined &&
                <CardContributor>
                  Patentti- ja rekisterihallitus
                </CardContributor>
              }
              <CardTitle variant='h2'>
                {concept.label[i18n.language] !== undefined ? concept.label[i18n.language] : concept?.label?.[Object.keys(concept.label)[0]]}
              </CardTitle>
              <CardSubtitle>
                {t('vocabulary-info-concept').toUpperCase()} &middot; {t(`${concept.status}`).toUpperCase()} {info !== undefined && <>&middot; <CardPill>LUONNOS</CardPill></>}
              </CardSubtitle>
              <CardDescription>
                {concept?.definition?.[i18n.language] !== undefined ? concept?.definition?.[i18n.language] : concept?.definition?.[Object.keys(concept?.definition)[0]]}
              </CardDescription>
              {info !== undefined &&
                <CardInfoDomain>
                  <b>Tietoalueet:</b> Yleiset tieto- ja hallintopalvelut
                </CardInfoDomain>
              }
            </Card>
          );
        })}
      </CardWrapper>
    </>
  );
}
