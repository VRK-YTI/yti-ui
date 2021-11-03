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
    color: hsl(202, 7%, 40%);
    font-size: 16px;
    padding-bottom: 5px;
  }

  .label {
    padding-left: 8px;
    font-size: 22px;
    font-weight: bold;
  }

  .category {
    color: hsl(202, 7%, 40%);
    font-size: 13px;
    font-weight: bold;
  }

  .status {
    color: hsl(202, 7%, 40%);
    font-size: 13px;
    font-weight: bold;
    margin-left: 4px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 25px;
    background-color: hsl(212, 63%, 95%);
  }

  .description {
    padding-top: 5px;
    padding-bottom: 12px;
  }

`;
