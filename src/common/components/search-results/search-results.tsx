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


export default function SearchResults({ data }: any) {
  const { t, i18n } = useTranslation('common');

  return (
    <>
      <SearchCountTags count={data?.totalHitCount}/>
      <CardWrapper>
        {data?.concepts.map((concept: any, idx: number) => {
          return (
            <Card key={`search-result-${idx}`}>
              <CardContributor>
                Patentti- ja rekisterihallitus
              </CardContributor>
              <CardTitle variant='h2'>
                {concept.label[i18n.language]}
              </CardTitle>
              <CardSubtitle>
                {t('vocabulary-info-concept').toUpperCase()} &middot; {t(`${concept.status}`).toUpperCase()} &middot; <CardPill>LUONNOS</CardPill>
              </CardSubtitle>
              <CardDescription>
                {concept.definition[i18n.language]}
              </CardDescription>
              <CardInfoDomain>
                <b>Tietoalueet:</b> Yleiset tieto- ja hallintopalvelut
              </CardInfoDomain>
            </Card>
          );
        })}
      </CardWrapper>
    </>
  );
}
