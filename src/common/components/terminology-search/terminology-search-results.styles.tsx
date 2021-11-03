import styled from 'styled-components';

export const SearchResultContainer = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  }


  .contributor {
    padding-bottom: 5px;
  }

  .label {
    padding-left: 5px;
    font-size: 22px;
    font-weight: bold;
  }

  .description {
    padding-top: 5px;
    padding-bottom: 15px;
  }

`;
