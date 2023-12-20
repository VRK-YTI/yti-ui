import { forwardRef, RefObject } from 'react';
import styled from 'styled-components';

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
    max-width: inherit;
  }

  button {
    flex-shrink: 0 !important;
    max-height: 42px !important;
  }

  #submit-button_submitted {
    flex-shrink: 1 !important;
    padding: 10px 14px;
  }

  .fi-loadingSpinner_text {
    font-weight: 600 !important;
  }

  .long-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 5 !important;
  }
`;

const Blur = styled.div`
  width: inherit;
  max-width: inherit;
  height: 30px;
  content: '';
  background: linear-gradient(to bottom, hsl(0, 0%, 100%), rgba(0, 0, 0, 0));
  position: fixed;
  padding: 0 !important;
  pointer-events: none;
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
