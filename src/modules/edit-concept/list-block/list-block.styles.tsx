import styled from 'styled-components';
import { Textarea } from 'suomifi-ui-components';

export const ListBlockWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const ListItem = styled.li<{ $isSmall?: boolean; $sameLevel?: boolean }>`
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  padding: ${(props) => props.theme.suomifi.spacing.m};
  min-width: ${(props) => (props.$isSmall ? 'auto' : '475px')};

  display: flex;
  flex-direction: ${(props) =>
    props.$sameLevel && !props.$isSmall ? 'column-reverse' : 'row'};
  flex-wrap: wrap;
  justify-content: space-between;

  .button-block {
    order: ${(props) => (props.$isSmall ? '2' : '1')};
    margin-top: ${(props) =>
      props.$isSmall || props.$sameLevel ? props.theme.suomifi.spacing.s : ''};
    min-height: 0;
    height: min-content;

    ${(props) =>
      props.$isSmall || props.$sameLevel
        ? `
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    `
        : ''};
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const ListItemTextarea = styled(Textarea)<{
  $noTopMargin?: boolean;
  $isSmall?: boolean;
}>`
  margin-top: ${(props) =>
    props.$noTopMargin ? '' : props.theme.suomifi.spacing.m};
  width: 760px;

  order: ${(props) => (props.$isSmall ? '1' : '2')};
  textarea {
    min-height: 88px;
  }
`;
