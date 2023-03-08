import styled from 'styled-components';
import SpacedContent from './spaced-content';

const DrawerContentWrapper = styled.div<{ $height?: number }>`
  width: calc(inherit - 30px);
  max-width: inherit;

  padding: 15px;
  padding-top: ${(props) => (props.$height ?? 0) + 15}px;

  .fullwidth {
    width: 100%;
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
