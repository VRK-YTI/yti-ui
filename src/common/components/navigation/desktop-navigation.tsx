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
import ClickOutsideListener from '@app/common/components/click-outside-listener';

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
        <Link href="/" passHref>
          <SuomiFiLink className="main" href="">
            {t('site-frontpage')}
          </SuomiFiLink>
        </Link>
      </NavigationItem>
      <NavigationItem>
        <SuomiFiLink className="main" href="" onClick={handleDropdown}>
          {t('site-services')}
          <Icon
            color={theme.suomifi.colors.highlightBase}
            icon={open ? 'chevronUp' : 'chevronDown'}
          />
        </SuomiFiLink>
        {open && (
          <ClickOutsideListener onClickOutside={() => setOpen(false)}>
            <NavigationDropdownWrapper>
              <NavigationDropdownList>
                <NavigationDropdownItem>
                  <SuomiFiLink href="/">{t('terminology-title')}</SuomiFiLink>
                </NavigationDropdownItem>
                <NavigationDropdownItem>
                  <SuomiFiLink href="/">{t('codelist-title')}</SuomiFiLink>
                </NavigationDropdownItem>
                <NavigationDropdownItem>
                  <SuomiFiLink href="/">{t('datamodel-title')}</SuomiFiLink>
                </NavigationDropdownItem>
              </NavigationDropdownList>
            </NavigationDropdownWrapper>
          </ClickOutsideListener>
        )}
      </NavigationItem>
      <NavigationItem>
        <SuomiFiLink className="main" href="/">
          {t('site-information')}
        </SuomiFiLink>
      </NavigationItem>
      <NavigationItem>
        <SuomiFiLink className="main" href="/">
          {t('site-for-developers')}
        </SuomiFiLink>
      </NavigationItem>
      <NavigationItem>
        <SuomiFiLink className="main" href="/">
          {t('site-for-administrators')}
        </SuomiFiLink>
      </NavigationItem>
      {isLoggedIn && (
        <NavigationItem active={router.pathname === '/own-information'}>
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
