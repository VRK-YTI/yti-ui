import { default as styled } from 'styled-components';
import { Block, Textarea } from 'suomifi-ui-components';

export const ItemsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  > li {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const ColoredBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: ${(props) => props.theme.suomifi.spacing.m};

  > *:not(:first-child):not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  > div:first-child {
    display: flex;
    justify-content: space-between;
  }
`;

export const FullwidthTextarea = styled(Textarea)`
  width: 100%;
`;
