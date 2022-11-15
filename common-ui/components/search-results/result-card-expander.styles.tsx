import styled from "styled-components";
import { Block, Heading } from "suomifi-ui-components";

export const ExpanderContentTitle = styled(Heading)`
  font-size: 16px !important;
  margin-bottom: 5px;
`;

export const ExpanderTitleHits = styled(Block)`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  margin: 0;
  padding: 0;
`;

export const HitsWrapper = styled(Block)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  column-gap: 20px;
  row-gap: 5px;

  > * {
    font-size: 16px;
  }
`;
