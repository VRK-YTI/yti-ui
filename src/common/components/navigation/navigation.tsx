import { Menu, MenuItem } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from 'suomifi-ui-components';
import { LayoutProps } from '../layout/layout-props';
import { NavigationWrapper } from './navigation.styles';

export default function Navigation({ props }: { props: LayoutProps }) {

  const { t } = useTranslation('common');
  const isLarge = props.isLarge;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDropdown = (event: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (

    <NavigationWrapper hidden={!isLarge}>

      <li>
        <Link href="/">{t('site-frontpage')}</Link>
      </li>
      <li>
        <Link href="" onClick={handleDropdown}>{t('site-services')} <Icon icon={open ? 'arrowUp' : 'arrowDown'} /></Link>
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '200px',
              transform: 'translateX(0%) translateY(50%)',
            }
          }}
        >
          <MenuItem>
            Foo
          </MenuItem>
          <MenuItem>
            Bar
          </MenuItem>
        </Menu>
      </li>
      <li>
        <Link href="/">{t('site-information')}</Link>
      </li>
      <li>
        <Link href="/">{t('site-for-developers')}</Link>
      </li>
      <li>
        <Link href="/">{t('site-for-administrators')}</Link>
      </li>
    </NavigationWrapper>

  );
}
