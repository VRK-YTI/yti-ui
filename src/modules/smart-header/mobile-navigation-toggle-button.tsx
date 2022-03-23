import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '../../common/components/icon-button/icon-button';

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
      isLarge
      icon={isOpen ? 'close' : 'menu'}
      aria-label={isOpen ? t('navigation-close') : t('navigation-open')}
      onClick={() => setIsOpen((isOpen) => !isOpen)}
    />
  );
}
