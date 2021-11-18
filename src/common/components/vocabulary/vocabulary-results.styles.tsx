import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';

export const ResultContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

export const ResultWrapper = styled.div`
  margin-bottom: 16px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 12px;
    border-top: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    border-right: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    background-color: ${(props) => props.theme.suomifi.colors.whiteBase}
  }

  li {
    border-bottom: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    padding: 12px;
    padding-left: 16px;
  }

`;

export const ResultHeading = styled(Heading)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
`;

export const TypeStatusWrapper = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};

  span {
    margin-right: 4px;
  }
`;

export const DefinitionDiv = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
`;
