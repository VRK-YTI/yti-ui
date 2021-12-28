import styled from 'styled-components';

export const MultilingualDefinitionListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 12px;
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  font-size: ${props => props.theme.suomifi.typography.bodyTextSmall};
`;

export const MultilingualDefinitionListItem = styled.li`
  &:not(:last-child) {
    border-bottom: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  padding-top: ${props => props.theme.suomifi.spacing.insetS};
  padding-bottom: ${props => props.theme.suomifi.spacing.insetM};
  padding-left: ${props => props.theme.suomifi.spacing.xxxl};
  padding-right: ${props => props.theme.suomifi.spacing.m};
  position: relative;

  &:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  }

  &:before {
    content: attr(lang);
    text-transform: uppercase;
    position: absolute;
    left: ${props => props.theme.suomifi.spacing.s};
    font-weight: 600;
  }
`;
