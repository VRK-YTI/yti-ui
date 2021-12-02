import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const InfoBlockData = styled.div`
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  > * {
    border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    padding-bottom: 8px;
    padding-left: 15px;
    padding-top: 6px;
  }

  div:nth-child(even) {
    background-color:  ${(props) => props.theme.suomifi.colors.depthLight2};
  }
`;

export const InfoBlockDescription = styled(Text)`
  font-size: 16px;
`;

export const InfoBlockLanguage = styled(Text)`
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  width: 47px;
`;

export const InfoBlockTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
`;

export const InfoBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;
