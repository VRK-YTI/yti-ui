import { default as styled } from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const FormWrapper = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: ${(props) => props.theme.suomifi.spacing.m};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxxxl};
`;

export const FormTitle = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xl};
`;

export const FormFooter = styled(Block)`
  section {
    width: 100%;
  }

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;

export const ButtonBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
