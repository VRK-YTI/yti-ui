import styled from 'styled-components';
import { Checkbox, Icon } from 'suomifi-ui-components';

export const VocabularyFilterContainer = styled.div`
  width: 350px;
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  padding: 20px;
`;

export const VocabularyFilterHeader = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 20px;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: white;
  min-height: 50px;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

export const VocabularyFilterHr = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const VocabularyFilterCheckbox = styled(Checkbox)`
  padding-top: 6px;
`;

export const VocabularyRemoveWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
  padding-left: 24px;

  &:hover {
    text-decoration: underline;
    text-decoration-color: hsl(212, 63%, 45%);
    cursor: pointer;
  }
`;

export const VocabularyFilterRemove = styled(Icon)`
  color: hsl(212, 63%, 45%);
  padding-right: 5px;
`;
