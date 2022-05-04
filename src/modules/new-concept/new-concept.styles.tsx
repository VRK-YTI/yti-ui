import styled from 'styled-components';
import { Block } from 'suomifi-ui-components';

export const NewConceptBlock = styled(Block)`
  background: white;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  margin-bottom: 80px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  padding: 30px 80px 20px 80px;
`;

export const HeadingBlock = styled.div`
  h1 {
    line-height: 52px;
  }

  & > :first-child {
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    font-size: 16px;
    line-height: 24px;
  }
`;

export const BadgeBar = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  line-height: 15px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const Badge = styled.span<{ isValid?: boolean }>`
  line-height: 18px;
  border-radius: 10px;
  padding: 0 5px;
  background-color: ${(props) =>
    props.isValid
      ? props.theme.suomifi.colors.successBase
      : props.theme.suomifi.colors.depthDark2};
  color: white;
  height: 18px;
  display: inline-block;
`;
