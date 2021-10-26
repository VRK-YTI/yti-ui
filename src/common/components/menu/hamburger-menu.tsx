import { Divider, IconButton, Menu, MenuItem } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link, Text } from 'suomifi-ui-components';
import AuthenticationPanel from '../authentication-panel/authentication-panel';
import { LayoutProps } from '../layout/layout-props';
import { ButtonWrapper, MenuItemWrapper, MenuWrapper } from './hamburger-menu-styles';

export default function HamburgerMenu({ props }: { props: LayoutProps }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChance = (locale: string) => {
    router.push(router.asPath, router.asPath, {
      locale,
    });
  };

  return (
    <>
      <MenuWrapper>
        <IconButton onClick={handleClick}>
          <Icon icon={open ? 'close' : 'menu'} />
        </IconButton>
        <Menu id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          marginThreshold={0}
          PaperProps={{
            style: {
              width: '100%',
              maxWidth: 'none',
              transform: 'translateX(0%) translateY(12%)',
            }
          }}
        >
          <MenuItem>
            <ButtonWrapper>
              <AuthenticationPanel props={props} onMenuClose={handleClose} />
            </ButtonWrapper>
          </MenuItem>
          <Divider />

          <MenuItemWrapper active={router.pathname === '/'}>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('site-frontpage')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <MenuItem>
              <Text>{t('site-services')}</Text>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper subPage>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('terminology-title')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper subPage>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('codelist-title')}</Link>
            </MenuItem>
          </MenuItemWrapper >
          <MenuItemWrapper subPage>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('datamodel-title')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('site-information')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('site-for-developers')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <MenuItem onClick={handleClose}>
              <Link href="/">{t('site-for-administrators')}</Link>
            </MenuItem>
          </MenuItemWrapper>
          <Divider />
          <MenuItem onClick={() => handleLocaleChance('fi')}>
            Suomeksi (FI)
          </MenuItem>
          <MenuItem onClick={() => handleLocaleChance('sv')}>
            På svenska (SV)
          </MenuItem>
          <MenuItem onClick={() => handleLocaleChance('en')}>
            In English (EN)
          </MenuItem>
        </Menu>
      </MenuWrapper>
    </>
  );
}
