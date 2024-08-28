import styled from 'styled-components';
import { Block, Button, Paragraph } from 'suomifi-ui-components';

export const TypeSelectorWrapper = styled.div`
    margin-top: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const HeadingAndCountWrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: space-between;
`;

export const InstructionParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.suomifi.colors.blackLight1};
  font-size: 0.9rem;
`;

export const TypeSearchResultWrapper = styled(Block)`
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthBase};
  margin: 5px;
  padding-top: 5px;
  display: flex;
  && h5 {
    font-weight: normal;
    font-size: 0.9rem;
  }
  && p {
    color: ${(props) => props.theme.suomifi.colors.blackLight1};
    font-size: 0.9rem;
  }
  && a {
    align-self: center;
    padding: 5px;
  }
`;

export const ResultButton = styled(Button)`
  word-break: keep-all;
`;

export const TypeInfoWrapper = styled.div`
  flex-grow: 5;
  padding-right: 3px;
`;
