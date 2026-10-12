import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button, IconClose, IconMenu } from 'suomifi-ui-components';

export interface MobileNavigationToggleButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNavigationToggleButton({
  isOpen,
  setIsOpen,
}: MobileNavigationToggleButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      icon={isOpen ? <IconClose /> : <IconMenu />}
      aria-label={isOpen ? t('navigation-close') : t('navigation-open')}
      onClick={() => setIsOpen((isOpen) => !isOpen)}
    />
  );
}
