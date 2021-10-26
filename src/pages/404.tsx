import { Heading, Link, Paragraph, Text } from 'suomifi-ui-components';
import Layout from '../common/components/layout/layout';
import { ErrorPageWrapper } from './error-page-styles';

export default function Custom404() {
  return <Layout error>
    <ErrorPageWrapper>
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
    </ErrorPageWrapper>
  </Layout>;
}
