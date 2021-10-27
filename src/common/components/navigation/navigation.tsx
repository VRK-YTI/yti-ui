
import { ClickAwayListener } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from 'suomifi-ui-components';
import { LayoutProps } from '../layout/layout-props';
import { NavigationDropdownItem, NavigationDropdownList, NavigationDropdownWrapper, NavigationItem, NavigationWrapper } from './navigation.styles';

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
      <NavigationItem active>
        <Link className="main" href="/">{t('site-frontpage')}</Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="" onClick={(e) => handleDropdown(e)}>{t('site-services')} <Icon icon={open ? 'arrowUp' : 'arrowDown'} /></Link>
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
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">{t('site-information')}</Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">{t('site-for-developers')}</Link>
      </NavigationItem>
      <NavigationItem>
        <Link className="main" href="/">{t('site-for-administrators')}</Link>
      </NavigationItem>
    </NavigationWrapper>

  );
}
