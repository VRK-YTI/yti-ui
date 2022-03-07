import { Heading, Link, Paragraph, Text } from "suomifi-ui-components";
import { ErrorPageWrapper } from "./error-styles";

export interface ErrorProps {
  errorCode?: number;
}

export default function Error({ errorCode }: ErrorProps) {
  if (!errorCode) {
    return (
      <ErrorPageWrapper>
        <Heading variant="h1">Error - 404</Heading>
        <Paragraph>
          <Text>Sivua ei löydy</Text>
          <br />
          <Link href="/">Etusivulle</Link>
        </Paragraph>

        <Paragraph>
          <Text>Sidan hittas inte</Text>
          <br />
          <Link href="/">Startsida</Link>
        </Paragraph>

        <Paragraph>
          <Text>Page not found</Text>
          <br />
          <Link href="/">Front page</Link>
        </Paragraph>
      </ErrorPageWrapper>
    );
  }

  return (
    <ErrorPageWrapper>
      <Heading variant="h1">Error - {errorCode}</Heading>
      <Paragraph>
        <Text>Jotain meni pieleen</Text>
        <br />
        <Link href="/">Etusivulle</Link>
      </Paragraph>

      <Paragraph>
        <Text>Något gick fel</Text>
        <br />
        <Link href="/">Startsida</Link>
      </Paragraph>

      <Paragraph>
        <Text>Something went wrong</Text>
        <br />
        <Link href="/">Front page</Link>
      </Paragraph>
    </ErrorPageWrapper>
  );
}
