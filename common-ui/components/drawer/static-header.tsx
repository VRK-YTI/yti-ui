import { forwardRef, RefObject } from 'react';
import { default as styled } from 'styled-components';

const StaticHeaderWrapper = styled.div`
  width: inherit;
  max-width: inherit;
  position: fixed;
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  z-index: 2;
  height: min-content;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${(props) => props.theme.suomifi.spacing.s};
    padding-bottom: 0;
  }
`;

const Blur = styled.div`
  width: inherit;
  max-width: inherit;
  height: 20px;
  content: '';
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
  position: fixed;
  padding: 0 !important;
`;

interface StaticHeaderProps {
  ref: RefObject<HTMLDivElement>;
  children?: React.ReactElement | React.ReactElement[];
}

// Note: Apparently false positive coming from React 18 changes
// eslint-disable-next-line react/display-name
const StaticHeader = forwardRef<HTMLDivElement, StaticHeaderProps>(
  ({ children }, ref) => {
    return (
      <StaticHeaderWrapper ref={ref}>
        {children}
        <Blur />
      </StaticHeaderWrapper>
    );
  }
);

export default StaticHeader;
