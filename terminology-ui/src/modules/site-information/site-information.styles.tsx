import styled from 'styled-components';
import { Block, Heading } from 'suomifi-ui-components';

export const SiteTitle = styled(Heading)`
  margin-top: 18px;
  margin-bottom: 20px;
`;

export const TextBlock = styled(Block)`
  max-width: 955px;

  > * {
    margin-top: 15px;
  }

  *:last-child {
    margin-bottom: 30px;
  }
`;
