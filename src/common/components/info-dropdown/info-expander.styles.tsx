import styled from 'styled-components';
import { Block, Expander } from 'suomifi-ui-components';

export const InfoExpanderWrapper = styled(Expander)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const InfoExpanderDivider = styled.hr`
  border: 0;
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin: ${(props) => props.theme.suomifi.spacing.xl} 0;
`;

export const PropertyList = styled.ul`
  list-style: none;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 16px;

  li:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

export const ActionBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};

  > * {
    width: max-content;
  }
`;
