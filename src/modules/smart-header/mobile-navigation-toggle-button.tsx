import React from 'react';
import { Button } from 'suomifi-ui-components';

export interface MobileNavigationToggleButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavigationToggleButton({
  isOpen,
  setIsOpen
}: MobileNavigationToggleButtonProps) {
  return (
    <Button
      icon={isOpen ? 'close' : 'menu'}
      onClick={() => setIsOpen(isOpen => !isOpen)}
      variant="secondaryNoBorder"
    />
  );
}
