import { InfoBasicWrapper } from './info-basic.styles';
import { Text } from 'suomifi-ui-components';

/**
 * Error handling:
 * - if title is missing should there
 *   be an indication that it's missing?
 * -
 */

interface InfoBasicProps {
  data?: string;
  title: string;
  extra?: React.ReactNode;
}

export default function InfoBasic({ data, title, extra }: InfoBasicProps) {
  if (!data) {
    return null;
  }

  return (
    <InfoBasicWrapper>
      <Text variant="bold">{title}</Text>
      <Text>{data}</Text>
      {extra}
    </InfoBasicWrapper>
  );
}
