import styled from 'styled-components';

interface StatusTagProps {
  isValid: boolean;
}

export const TitleWrapper = styled.div`
  margin-bottom: 16px;
`;

export const StatusTag = styled.div`
  margin-top: 4px;
  margin-right: 2px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 25px;
  background-color: hsl(166, 90%, 30%);
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  width: max-content;
  font-size: 14px;
  font-weight: bold;
  background-color: ${( props: StatusTagProps ) => props.isValid ? 'hsl(166, 90%, 30%)' : 'hsl(202, 7%, 67%)'}
`;
