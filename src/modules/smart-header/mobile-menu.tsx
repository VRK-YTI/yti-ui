import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Text } from 'suomifi-ui-components';
import LoginButtons from '../../common/components/authentication-panel/login-buttons';
import MobileLanguageChooser from '../../common/components/language-chooser/mobile-language-chooser';
import User from '../../common/interfaces/user-interface';
import { MobileMenuItem, MobileMenuSection } from './smart-header.styles';

export interface MobileMenuProps {
  user?: User;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <LoginButtons user={user} isSmall />

      <MobileMenuSection>
        <MobileMenuItem>
          <Link href="/">{t('site-frontpage')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Text>{t('site-services')}</Text>
        </MobileMenuItem>
        <MobileMenuItem inset>
          <Link href="/">{t('terminology-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem inset>
          <Link href="/">{t('codelist-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem inset>
          <Link href="/">{t('datamodel-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem inset>
          <Link href="/">Kommentointi</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/">{t('site-information')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/">{t('site-for-developers')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/asdf">{t('site-for-administrators')}</Link>
        </MobileMenuItem>
      </MobileMenuSection>

      <MobileLanguageChooser />
    </>
  );
}
