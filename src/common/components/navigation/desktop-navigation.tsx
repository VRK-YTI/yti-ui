import { ClickAwayListener } from '@material-ui/core';
import { useRouter } from 'next/router';
import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Icon, Link } from 'suomifi-ui-components';
import { selectLogin } from '../login/login-slice';
import {
  NavigationDropdownItem,
  NavigationDropdownList,
  NavigationDropdownWrapper,
  NavigationItem,
  NavigationWrapper,
} from './navigation.styles';

export default function DesktopNavigation() {
  const isLoggedIn = !useSelector(selectLogin()).anonymous;
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDropdown: MouseEventHandler = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const theme = useTheme();

  return (
    <NavigationWrapper>
      <NavigationItem active={router.pathname === '/'}>
        <Link className="main" href="/">
          {t('site-frontpage')}
        </Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="" onClick={handleDropdown}>
          {t('site-services')}
          <Icon
            color={theme.suomifi.colors.highlightBase}
            icon={open ? 'chevronUp' : 'chevronDown'}
          />
        </Link>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <NavigationDropdownWrapper>
              <NavigationDropdownList>
                <NavigationDropdownItem>
                  <Link href="/">{t('terminology-title')}</Link>
                </NavigationDropdownItem>
                <NavigationDropdownItem>
                  <Link href="/">{t('codelist-title')}</Link>
                </NavigationDropdownItem>
                <NavigationDropdownItem>
                  <Link href="/">{t('datamodel-title')}</Link>
                </NavigationDropdownItem>
              </NavigationDropdownList>
            </NavigationDropdownWrapper>
          </ClickAwayListener>
        )}
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">
          {t('site-information')}
        </Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">
          {t('site-for-developers')}
        </Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">
          {t('site-for-administrators')}
        </Link>
      </NavigationItem>
      {isLoggedIn && (
        <NavigationItem active={router.pathname === '/own-information'}>
          <Link className="main" href="/own-information">
            {t('own-information')}
          </Link>
        </NavigationItem>
      )}
    </NavigationWrapper>
  );
}
