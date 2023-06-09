import styled from 'styled-components';
import { Button, Textarea } from 'suomifi-ui-components';

export const FullWidthTextarea = styled(Textarea)`
  width: 100%;

  .fi-textarea_textarea {
    height: 200px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 35px;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    min-width: 300px;
    max-width: 100%;
    flex: 1 1 0px;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.suomifi.spacing.xs};

  > div {
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.xxs};
  }

  .fi-hint-text {
    text-transform: lowercase;
  }
`;

export const ControlButton = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
`;

export const LanguageSelectorWrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
`;

export const LanguageSelectorBtn = styled(Button)<{ $active?: boolean }>`
  text-transform: uppercase;

  ${(props) =>
    props.$active &&
    `
    border-bottom: 2px solid ${props.theme.suomifi.colors.highlightBase} !important;
  `}
`;
