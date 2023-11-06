import styled from 'styled-components';

export interface MDLWProps {
  $maxSize: number;
}

export const MultilingualDefinitionListWrapper = styled.ul<MDLWProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};

  > li {
    padding-left: calc(
      ${(props) => props.theme.suomifi.spacing.s} + ${(props) => props.$maxSize} *
        7px + 25px
    );
  }
`;

export const MultilingualDefinitionListItem = styled.li`
  &:not(:last-child) {
    border-bottom: solid 1px
      ${(props) => props.theme.suomifi.colors.depthLight1};
  }

  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  padding-top: ${(props) => props.theme.suomifi.spacing.insetS};
  padding-bottom: ${(props) => props.theme.suomifi.spacing.insetM};
  padding-right: ${(props) => props.theme.suomifi.spacing.m};
  position: relative;

  &:nth-child(even) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  }

  &:before {
    content: attr(lang);
    text-transform: uppercase;
    position: absolute;
    left: ${(props) => props.theme.suomifi.spacing.s};
    font-weight: 600;
  }
`;
