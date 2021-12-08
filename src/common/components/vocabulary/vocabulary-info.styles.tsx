import styled from 'styled-components';

// TODO: Add margin-bottom: 16px to target every child
export const InformationContainer = styled.div`
`;

export const NameWrapper = styled.div`
  margin-bottom: 16px;
  max-width: 70%;
`;

export const DescriptionWrapper = styled.div`
  margin-bottom: 16px;
  max-width: 70%;
`;

export const InformationDomainWrapper = styled.div`
  margin-bottom: 16px;

  div {
    margin-top: 12px;
    margin-right: 2px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 25px;
    background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
    color: ${(props) => props.theme.suomifi.colors.depthLight2};
    font-weight: bold;
    width: max-content;
    display: inline;
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
