import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Icon, Link as SuomiFiLink } from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import {
  NavigationDropdownItem,
  NavigationDropdownList,
  NavigationDropdownWrapper,
  NavigationItem,
  NavigationWrapper,
} from './navigation.styles';
import ClickOutsideListener from '../click-outside-listener';

export default function DesktopNavigation() {
  // TODO: Remove false from here
  const isLoggedIn = !useSelector(selectLogin()).anonymous ?? false;
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDropdown: MouseEventHandler = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const theme = useTheme();

  return (
    <NavigationWrapper id="top-navigation">
      <NavigationItem
        active={router.pathname === '/'}
        id="top-navigation-front-page"
        className="top-navigation-li"
      >
        <Link href="/" passHref>
          <SuomiFiLink className="main" href="">
            {t('site-frontpage')}
          </SuomiFiLink>
        </Link>
      </NavigationItem>
      <NavigationItem
        id="top-navigation-services"
        className="top-navigation-li"
      >
        <SuomiFiLink className="main" href="" onClick={handleDropdown}>
          {t('site-tools')}
          <Icon
            color={theme.suomifi.colors.highlightBase}
            icon={open ? 'chevronUp' : 'chevronDown'}
          />
        </SuomiFiLink>
        {open && (
          <ClickOutsideListener onClickOutside={() => setOpen(false)}>
            <NavigationDropdownWrapper id="top-navigation-dropdown">
              <NavigationDropdownList>
                <NavigationDropdownItem className="top-navigation-dropdown-li">
                  <SuomiFiLink href="/">{t('terminology-title')}</SuomiFiLink>
                </NavigationDropdownItem>
                <NavigationDropdownItem className="top-navigation-dropdown-li">
                  <SuomiFiLink href="/">{t('codelist-title')}</SuomiFiLink>
                </NavigationDropdownItem>
                <NavigationDropdownItem className="top-navigation-dropdown-li">
                  <SuomiFiLink href="/">{t('datamodel-title')}</SuomiFiLink>
                </NavigationDropdownItem>
              </NavigationDropdownList>
            </NavigationDropdownWrapper>
          </ClickOutsideListener>
        )}
      </NavigationItem>
      <NavigationItem
        id="top-navigation-site-information"
        className="top-navigation-li"
      >
        <SuomiFiLink className="main" href="/">
          {t('site-information')}
        </SuomiFiLink>
      </NavigationItem>
      <NavigationItem
        id="top-navigation-for-developers"
        className="top-navigation-li"
      >
        <SuomiFiLink className="main" href="/">
          {t('site-for-developers')}
        </SuomiFiLink>
      </NavigationItem>
      <NavigationItem
        id="top-navigation-for-administrators"
        className="top-navigation-li"
      >
        <SuomiFiLink className="main" href="/">
          {t('site-for-administrators')}
        </SuomiFiLink>
      </NavigationItem>
      {isLoggedIn && (
        <NavigationItem
          active={router.pathname === '/own-information'}
          id="top-navigation-own-information"
          className="top-navigation-li"
        >
          <Link href="/own-information" passHref>
            <SuomiFiLink className="main" href="">
              {t('own-information')}
            </SuomiFiLink>
          </Link>
        </NavigationItem>
      )}
    </NavigationWrapper>
  );
}
