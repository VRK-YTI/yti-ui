import { Heading, Link, Paragraph, Text } from 'suomifi-ui-components';
import { MarginContainer } from '../../../layouts/layout.styles';
import { ErrorPageWrapper } from './error-styles';

export default function Error() {
  return (
    <ErrorPageWrapper>
      <MarginContainer breakpoint="small">
        <Heading variant="h1">Error - 404</Heading>
        <Paragraph>
          <Text>Sivua ei löydy</Text>
          <br/>
          <Link href="/">Etusivulle</Link>
        </Paragraph>

        <Paragraph>
          <Text>Sidan hittas inte</Text>
          <br/>
          <Link href="/">Startsida</Link>
        </Paragraph>

        <Paragraph>
          <Text>Page not found</Text>
          <br/>
          <Link href="/">Front page</Link>
        </Paragraph>
      </MarginContainer>
    </ErrorPageWrapper>
  );
}
