import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const TypeSelectorWrapper = styled.div`
`;

export const TypeSearchResultWrapper = styled(Block)`
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthBase};
  margin: 5px;
  padding-top: 5px;
  display: flex;
  && h5 {
    font-weight: normal;
    font-size: 0.9rem;
  }
  && p {
    color: ${(props) => props.theme.suomifi.colors.blackLight1};
    font-size: 0.9rem;
  }
`;

export const TypeInfoWrapper = styled.div`
`;
