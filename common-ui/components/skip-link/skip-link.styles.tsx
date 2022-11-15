import styled from "styled-components";

export const SkipLinkWrapper = styled("span")`
  a {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  a:active,
  a:focus {
    clip: auto;
    height: auto;
    margin: auto;
    overflow: visible;
    position: static;
    width: auto;
  }
`;
