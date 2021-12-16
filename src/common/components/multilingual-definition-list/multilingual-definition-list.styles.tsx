import styled from 'styled-components';

export const MultilingualDefinitionListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 12px;
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  font-size: 16px;
`;

export const MultilingualDefinitionListItem = styled.li`
  &:not(:last-child) {
    border-bottom: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  padding-top: 6px;
  padding-bottom: 8px;
  padding-left: 60px;
  padding-right: 20px;
  position: relative;

  &:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  }

  &:before {
    content: attr(lang);
    text-transform: uppercase;
    position: absolute;
    left: 15px;
    font-weight: 600;
  }
`;
