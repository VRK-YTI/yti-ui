import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Link, Text } from 'suomifi-ui-components';
import LoginButtons from '../authentication-panel/login-buttons';
import MobileImpersonateWrapper from '../impersonate/mobile-impersonate-wrapper';
import MobileLocaleChooser from '../locale-chooser/mobile-locale-chooser';
import { MobileMenuItem, MobileMenuSection } from './navigation.styles';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';

interface MobileNavigationProps {
  isLoggedIn: boolean;
  fakeableUsers?: FakeableUser[];
  hideSv?: boolean;
  handleLoginModalClick?: () => void;
}

export default function MobileNavigation({
  isLoggedIn,
  fakeableUsers,
  hideSv,
  handleLoginModalClick,
}: MobileNavigationProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <>
      <LoginButtons handleLoginModalClick={handleLoginModalClick} />

      <MobileMenuSection>
        <MobileMenuItem $active={router.pathname === '/'}>
          <Link href="/">{t('site-frontpage')}</Link>
        </MobileMenuItem>
        <MobileMenuItem>
          <Text>{t('site-services')}</Text>
        </MobileMenuItem>
        <MobileMenuItem $inset>
          <Link href="/">{t('terminology-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem $inset>
          <Link href="/">{t('codelist-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem $inset>
          <Link href="/">{t('datamodel-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem $inset>
          <Link href="/">{t('comments-title')}</Link>
        </MobileMenuItem>
        <MobileMenuItem $active={router.pathname === '/site-information'}>
          <Link href="/site-information">{t('site-information')}</Link>
        </MobileMenuItem>
        {isLoggedIn && (
          <MobileMenuItem $active={router.pathname === '/own-information'}>
            <Link className="main" href="/own-information">
              {t('own-information')}
            </Link>
          </MobileMenuItem>
        )}
      </MobileMenuSection>

      <MobileLocaleChooser hideSv={hideSv} />
      <MobileImpersonateWrapper fakeableUsers={fakeableUsers} />
    </>
  );
}
