import styled from 'styled-components';

export const HoverDropdownWrapper = styled.div`
  position: relative;

  & > *:not(:first-child) {
    display: none;
  }

  &:hover *:not(:first-child), &:focus-within *:not(:first-child) {
    display: block;
  }
`;

export const HoverDropdownListWrapper = styled.div`
  position: absolute;
  right: 0;
  width: 10rem;
  line-height: 2em;
  background: #fff;
  border: 1px solid #a5acb0;
  z-index: 1;
`;

export const HoverDropdownList = styled.ul`
  position: static;
  list-style-type: none;
  padding: 0;
  background-color: transparent;
  margin: 0;
`;

export const HoverDropdownItem = styled.li`
  padding: 0px;
  span, a, a:visited {
    padding-left: 10px;
    text-decoration: none;
    width: 100%;
    color: #000;
    background: transparent;
    border-left: 4px solid transparent;
    display: inline-block;
  }

  a:hover, a:focus {
    text-decoration: none;
    border-left: 4px solid ${props => props.theme.suomifi.colors.highlightBase};
  }
`;
