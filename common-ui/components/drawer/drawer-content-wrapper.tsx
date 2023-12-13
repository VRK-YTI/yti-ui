import styled from 'styled-components';
import SpacedContent from './spaced-content';

const DrawerContentWrapper = styled.div<{ $height?: number }>`
  position: absolute;
  width: calc(100% - 30px);
  max-width: inherit;
  height: calc(100% - ${(props) => (props.$height ?? 0) + 30}px);

  padding: 15px;
  margin-top: ${(props) => props.$height ?? 0}px;

  .fullwidth {
    width: 100%;
  }

  a {
    font-size: 16px;
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
