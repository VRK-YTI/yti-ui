import styled from 'styled-components';

export const FooterContentWrapper = styled.div`
  padding: 15px 0px 15px 0px;
  border-bottom: ${(props) => `2px solid ${props.theme.suomifi.colors.depthLight2}`};
  span {
    display: inline-block;
    padding-top: 10px;
  }
`

export const FooterLinkWrapper = styled.div`
  display: flex;
  padding-top: 10px;
  column-gap: 40px;
  justify-content: flex-start;
`