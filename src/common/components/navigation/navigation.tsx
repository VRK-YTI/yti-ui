
import { ClickAwayListener } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link, Text } from 'suomifi-ui-components';
import { LayoutProps } from '../layout/layout-props';
import { NavigationDropdownItem, NavigationDropdownList, NavigationDropdownWrapper, NavigationWrapper } from './navigation.styles';

export default function Navigation({ props }: { props: LayoutProps }) {

  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  const isLarge = props.isLarge;

  const handleDropdown = (e: any) => {
    e.preventDefault();
    setOpen(!open);
  };

  return (

    <NavigationWrapper hidden={!isLarge}>

      <li>
        <Link className="main" href="/">{t('site-frontpage')}</Link>
      </li>
      <li>
        <Link className="main dropdown" href="" onClick={(e) => handleDropdown(e)}>{t('site-services')} <Icon icon={open ? 'arrowUp' : 'arrowDown'} /></Link>
        {open &&
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
        }
      </li>
      <li>
        <Link className="main" href="/">{t('site-information')}</Link>
      </li>
      <li>
        <Link className="main" href="/">{t('site-for-developers')}</Link>
      </li>
      <li>
        <Link className="main" href="/">{t('site-for-administrators')}</Link>
      </li>
    </NavigationWrapper>

  );
}
