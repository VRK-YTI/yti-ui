import styled from 'styled-components';
import SpacedContent from './spaced-content';

const DrawerContentWrapper = styled.div<{ $height?: number }>`
  position: absolute;
  width: calc(100% - 30px);
  max-width: inherit;
  height: 100%;

  padding: 15px;
  padding-top: ${(props) => (props.$height ?? 0) + 15}px;

  .fullwidth {
    width: 100%;
  }

  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6e6e6e;
  }

  -webkit-transform: translate3d(0, 0, 0);
`;

interface DrawerContentProps {
  height?: number;
  children?: React.ReactElement | React.ReactElement[];
  spaced?: boolean;
}

export default function DrawerContent({
  height,
  children,
  spaced = false,
}: DrawerContentProps) {
  return (
    <DrawerContentWrapper $height={height}>
      {spaced ? <SpacedContent>{children}</SpacedContent> : children}
    </DrawerContentWrapper>
  );
}
