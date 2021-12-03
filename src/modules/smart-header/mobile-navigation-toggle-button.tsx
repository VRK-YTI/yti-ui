import React from 'react';
import IconButton from '../../common/components/icon-button/icon-button';

export interface MobileNavigationToggleButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavigationToggleButton({
  isOpen,
  setIsOpen
}: MobileNavigationToggleButtonProps) {
  return (
    <IconButton
      icon={isOpen ? 'close' : 'menu'}
      aria-label={isOpen ? 'Sulje navigaaio' : 'Avaa navigaatio'}
      onClick={() => setIsOpen(isOpen => !isOpen)}
    />
  );
}
