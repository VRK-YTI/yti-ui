import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Text } from 'suomifi-ui-components';
import AuthenticationPanel from '../../common/components/authentication-panel/authentication-panel';
import User from '../../common/interfaces/user-interface';
import { MobileMenuButtonWrapper, MobileMenuItem, MobileMenuLanguageItem, MobileMenuLanguageSection, MobileMenuSection } from './smart-header.styles';

export interface MobileMenuProps {
  user?: User;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const { t } = useTranslation('common');

  return (
    <>
      {user?.anonymous ? (
        <MobileMenuButtonWrapper>
          <AuthenticationPanel props={{ isSmall: true, user }} />
        </MobileMenuButtonWrapper>
      ) : null}
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
      <MobileMenuLanguageSection>
        <MobileMenuLanguageItem active>
          <Text>Suomeksi (FI)</Text>
        </MobileMenuLanguageItem>
        <MobileMenuLanguageItem>
          <Link href="/asdf">På svenska (SV)</Link>
        </MobileMenuLanguageItem>
        <MobileMenuLanguageItem>
          <Link href="/asdf">In English (EN)</Link>
        </MobileMenuLanguageItem>
      </MobileMenuLanguageSection>
    </>
  );
}
