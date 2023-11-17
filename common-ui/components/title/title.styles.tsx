import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const Contributor = styled(Text)`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const Description = styled(Text)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const TitleDescriptionWrapper = styled.div<{ $isSmall: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isSmall ? 'column' : 'row')};
  gap: 20px;
  justify-content: space-between;
  align-items: baseline;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const TitleType = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const TitleTypeAndStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapperNoBreadcrumb = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 18px;
`;
