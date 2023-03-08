import styled from 'styled-components';

const SpacedContentWrapper = styled.div`
  > div {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

interface SpacedContentProps {
  children?: React.ReactElement | React.ReactElement[];
}

export default function SpacedContent({ children }: SpacedContentProps) {
  return <SpacedContentWrapper>{children}</SpacedContentWrapper>;
}
