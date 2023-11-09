import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';

export const FacetTitle = styled(Heading)`
  && {
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    font-size: 16px;
    text-transform: uppercase;
  }
`;
