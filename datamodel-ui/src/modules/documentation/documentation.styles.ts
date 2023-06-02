import styled from 'styled-components';
import { Button, Textarea } from 'suomifi-ui-components';

export const FullWidthTextarea = styled(Textarea)`
  width: 100%;
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
  gap: 5px;
`;

export const ControlButton = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
`;
