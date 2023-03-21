import { ReactFragment, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

const ButtonContainer = styled.div`
  display: flex;
  max-width: 100vw;
  width: 100vw;
  justify-content: space-between;
  max-height: 100px;
  height: 100px;
`;

const ScrollableButtons = styled.div<{ $hightlight: number }>`
  display: flex;
  white-space: nowrap;
  overflow: hidden;

  > button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100px !important;
    max-height: 80px !important;
  }

  button:nth-child(${(props) => props.$hightlight}) {
    border-top: 2px solid ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export default function ScrollableButtonMenu({
  buttons,
}: {
  buttons: ReactFragment | ReactFragment[];
}) {
  const [currentRef, setCurrentRef] = useState(1);
  const searchRef = useRef(null);
  const graphRef = useRef(null);
  const infoRef = useRef(null);
  const linkRef = useRef(null);
  const classRef = useRef(null);
  const attributeRef = useRef(null);
  const associationRef = useRef(null);

  const handleClick = (value: number) => {
    if ((value < 0 && currentRef > 1) || (value > 0 && currentRef < 7)) {
      const currNumber = currentRef + value;
      setCurrentRef(currNumber);
      setRef(currNumber);
      return;
    }
  };

  const setRef = (value: number) => {
    switch (value) {
      case 1:
        searchRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        return;
      case 2:
        graphRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        return;
      case 3:
        infoRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        return;
      case 4:
        linkRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        return;
      case 5:
        classRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
        return;
      case 6:
        attributeRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'end',
        });
        return;
      case 7:
        associationRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'end',
        });
        return;
    }
  };

  return (
    <ButtonContainer>
      <Button
        variant="secondaryNoBorder"
        icon="chevronLeft"
        onClick={() => handleClick(-1)}
      />
      <ScrollableButtons $hightlight={currentRef}>
        <Button
          ref={searchRef}
          icon="search"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(1)}
        >
          HAE
        </Button>
        <Button
          ref={graphRef}
          icon="applicationProfile"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(2)}
        >
          KAAVIO
        </Button>
        <Button
          ref={infoRef}
          icon="info"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(3)}
        >
          TIEDOT
        </Button>
        <Button
          ref={linkRef}
          icon="attachment"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(4)}
        >
          LINKITYKSET
        </Button>
        <Button
          ref={classRef}
          icon="chatHeart"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(5)}
        >
          LUOKAT
        </Button>
        <Button
          ref={attributeRef}
          icon="history"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(6)}
        >
          ATTRIBUUTIT
        </Button>
        <Button
          ref={associationRef}
          icon="swapVertical"
          variant="secondaryNoBorder"
          onClick={() => setCurrentRef(7)}
        >
          ASSOSIAATIOT
        </Button>
      </ScrollableButtons>
      <Button
        variant="secondaryNoBorder"
        icon="chevronRight"
        onClick={() => handleClick(1)}
      />
    </ButtonContainer>
  );
}
