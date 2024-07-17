import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';

export const VersionHistoryContainer = styled.div`
  color: ${(props) => props.theme.suomifi.colors.blackBase};
`;

export const VersionHeading = styled(Heading)`
  && {
    font-size: 1.2rem;
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    margin-bottom: 0.5em;
  }
`;
