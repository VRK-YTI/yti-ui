import { Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { ErrorCard, ErrorIcon, HomePageLink, ParagraphTitle, TextBlock } from './error.styles';
import Link from 'next/link';

export interface ErrorProps {
  errorCode?: number;
}

export default function Error({ errorCode }: ErrorProps) {
  const { isSmall } = useBreakpoints();

  return (
    <ErrorCard $isSmall={isSmall}>
      <ErrorIcon icon='failure' />
      <TextBlock>
        <div>
          <ParagraphTitle variant='h2'>Sivua ei löytynyt</ParagraphTitle>
          <Paragraph>
            <Text smallScreen>
              Etsimääsi sivua ei valitettavasti löytynyt. Tätä sivua ei ole saatavilla tai sivun osoite on muuttunut. Tarkistathan, että kirjoittamasi osoite on oikein.
            </Text>
          </Paragraph>
          <Paragraph>
            <Link href='/'>
              <HomePageLink href=''>Siirry etusivulle</HomePageLink>
            </Link>
          </Paragraph>
        </div>
        <div>
          <ParagraphTitle variant='h2'>Sidan kunde inte hittas</ParagraphTitle>
          <Paragraph>
            <Text smallScreen>
              Sidan som du sökte kunde tyvärr inte hittas. Den här sidan finns inte eller sidan har flyttats. Vänligen kontrollera att adressen är korrekt.
            </Text>
          </Paragraph>
          <Paragraph>
            <Link href='/'>
              <HomePageLink href=''>Gå till startsidan</HomePageLink>
            </Link>
          </Paragraph>
        </div>
        <div>
          <ParagraphTitle variant='h2'>Page was not found</ParagraphTitle>
          <Paragraph>
            <Text smallScreen>
              The page you were looking for could not be found. This page is not available or the page has been moved. Please make sure that the address is spelled correctly.
            </Text>
          </Paragraph>
          <Paragraph>
            <Link href='/'>
              <HomePageLink href=''>Go to the home page</HomePageLink>
            </Link>
          </Paragraph>
        </div>
      </TextBlock>
    </ErrorCard>
  );
}
