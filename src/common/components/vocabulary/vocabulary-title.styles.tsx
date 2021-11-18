import styled from 'styled-components';

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
  color: ${(props) => props.theme.suomifi.colors.depthLight2};
  width: max-content;
  font-size: 14px;
  font-weight: bold;
`;
