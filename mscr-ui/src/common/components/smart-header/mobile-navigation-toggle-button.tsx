import React from 'react';
import { useTranslation } from 'next-i18next';
import IconButton from 'yti-common-ui/icon-button';
import { IconClose, IconMenu } from 'suomifi-icons';

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
    <IconButton
      icon={isOpen ? <IconClose /> : <IconMenu />}
      aria-label={isOpen ? t('navigation-close') : t('navigation-open')}
      onClick={() => setIsOpen((isOpen) => !isOpen)}
    />
  );
}
