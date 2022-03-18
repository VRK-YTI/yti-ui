import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Text } from 'suomifi-ui-components';
import LoginButtons from '../authentication-panel/login-buttons';
import MobileImpersonateWrapper from '../impersonate/mobile-impersonate-wrapper';
import MobileLocaleChooser from '../locale-chooser/mobile-locale-chooser';
import { selectLogin } from '../login/login-slice';
import { MobileMenuItem, MobileMenuSection } from './navigation.styles';

interface MobileNavigationProps {
  handleLoginModalClick?: () => void;
}

export default function MobileNavigation({
  handleLoginModalClick,
}: MobileNavigationProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isLoggedIn = !useSelector(selectLogin()).anonymous;

  return (
    <>
      <LoginButtons handleLoginModalClick={handleLoginModalClick} />

      <MobileMenuSection>
        <MobileMenuItem active={router.pathname === '/'}>
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
          <Link href="/">{t('comments-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/">{t('site-information')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/">{t('site-for-developers')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Link href="/">{t('site-for-administrators')}</Link>
        </MobileMenuItem>
        {isLoggedIn && (
          <MobileMenuItem active={router.pathname === '/own-information'}>
            <Link className="main" href="/own-information">
              {t('own-information')}
            </Link>
          </MobileMenuItem>
        )}
      </MobileMenuSection>

      <MobileLocaleChooser />
      <MobileImpersonateWrapper />
    </>
  );
}
