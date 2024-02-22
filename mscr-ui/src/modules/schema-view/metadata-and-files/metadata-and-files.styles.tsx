import styled from 'styled-components';

export const DescriptionListTitle = styled.dt`
  font-weight: 400;
  &::after {
    content: ':';
  }
`;

export const DescriptionList = styled.dl`
  padding: 20px 0;
`;
