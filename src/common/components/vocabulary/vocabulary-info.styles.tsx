import styled from 'styled-components';

// TODO: Add margin-bottom: 16px to target every child
export const InformationContainer = styled.div`
`;

export const NameWrapper = styled.div`
  margin-bottom: 16px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 12px;
    border-top: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    border-right: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    max-width: 70%;
  }

  b {
    min-width: 50px;
    display: inline-block;
  }

  li {
    border-bottom: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 12px;
  }

  li:nth-child(1) {
    background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  }

  li:nth-child(2) {
    background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  }
`;

export const DescriptionWrapper = styled.div`
  margin-bottom: 16px;

  div {
    border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
    max-width: 70%;
    margin-top: 6px;
    padding-top: 6px;
    padding-bottom: 6px;
    display: flex;
  }

  b {
    min-width: 50px;
    display: inline-block;
    padding-left: 16px;
  }
`;

export const InformationDomainWrapper = styled.div`
  margin-bottom: 16px;

  div {
    margin-top: 12px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 25px;
    background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
    color: ${(props) => props.theme.suomifi.colors.depthLight2};
    font-weight: bold;
    width: max-content;
  }
`;

export const SimpleInformationWrapper = styled.div`
  margin-bottom: 16px;

  div {
    margin-top: 6px;
  }
`;

export const HR = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-top: 30px;
  margin-bottom: 30px;
`;
