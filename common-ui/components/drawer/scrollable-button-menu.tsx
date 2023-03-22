import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, BaseIconKeys } from 'suomifi-ui-components';

const ButtonContainer = styled.div`
  display: flex;
  max-width: 100vw;
  width: 100vw;
  justify-content: space-between;
  max-height: 80px !important;
  height: 80px !important;
  position: static !important;
  bottom: 0 !important;
`;

const ScrollableButtons = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;

  > button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100px !important;
    height: 80px !important;
    text-transform: uppercase;

    > svg {
      margin: 0 !important;
    }
  }

  .current-view {
    border-top: 3px solid ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export default function ScrollableButtonMenu({
  buttons,
}: {
  buttons: {
    id: string;
    icon: BaseIconKeys;
    label: string;
    onClick: () => void;
  }[];
}) {
  const [currentRef, setCurrentRef] = useState<HTMLButtonElement | null>();
  const bRef = useRef<{
    [key: number]: HTMLButtonElement;
  }>({});

  const handleClick = (id: string) => {
    const newRef = Object.values(bRef.current).find((curr) => curr.id === id);
    setCurrentRef(newRef);
    setRef(newRef);
    buttons.find((button) => button.id === id)?.onClick();
  };

  const handleChevronClick = (value: number) => {
    const currentNumberIdx = buttons.findIndex(
      (button) => currentRef && button.id === currentRef.id
    );
    const newIdx = currentNumberIdx + value;

    if (newIdx < buttons.length && newIdx >= 0) {
      const newRef = bRef.current[newIdx];
      setCurrentRef(newRef);
      setRef(newRef);
      buttons.find((button) => button.id === newRef.id)?.onClick();
    }
  };

  const setRef = (value?: HTMLButtonElement) => {
    if (value) {
      value.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (!currentRef) {
      const newRef = Object.values(bRef.current).find(
        (curr) => curr.id === 'search'
      );
      setCurrentRef(newRef);
    }
  }, [currentRef]);

  return (
    <ButtonContainer>
      <Button
        variant="secondaryNoBorder"
        icon="chevronLeft"
        onClick={() => handleChevronClick(-1)}
      />
      <ScrollableButtons>
        {buttons.map((button, idx) => (
          <Button
            id={button.id}
            key={button.id}
            icon={button.icon}
            onClick={() => handleClick(button.id)}
            ref={(e) => (e !== null ? (bRef.current[idx] = e) : undefined)}
            variant="secondaryNoBorder"
            className={currentRef?.id === button.id ? 'current-view' : ''}
          >
            {button.label}
          </Button>
        ))}
      </ScrollableButtons>
      <Button
        variant="secondaryNoBorder"
        icon="chevronRight"
        onClick={() => handleChevronClick(1)}
      />
    </ButtonContainer>
  );
}
