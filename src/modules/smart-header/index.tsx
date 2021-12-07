import React, { useState } from 'react';
import { Block } from 'suomifi-ui-components';
import Modal from 'react-modal';
import User from '../../common/interfaces/user-interface';
import { HeaderContainer, MarginContainer, NavigationContainer } from '../../layouts/layout.styles';
import Logo from './logo';
import MobileNavigationToggleButton from './mobile-navigation-toggle-button';
import { HeaderWrapper, ModalOverlay, ModalContent } from './smart-header.styles';
import DesktopAuthenticationPanel from '../../common/components/authentication-panel/desktop-authentication-panel';
import DesktopNavigation from '../../common/components/navigation/desktop-navigation';
import MobileNavigation from '../../common/components/navigation/mobile-navigation';
import DesktopLocaleChooser from '../../common/components/locale-chooser/desktop-locale-chooser';
import UserInfo from '../../common/components/authentication-panel/user-info';
import HeaderSearch from '../../common/components/header-search/header-search';

Modal.setAppElement('#__next');

export default function SmartHeader({ isSmall, user, error }: { isSmall: boolean, user?: User, error?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const header = (
    <Block variant="header">
      <HeaderContainer isSmall={isSmall}>
        <MarginContainer isSmall={isSmall}>
          <HeaderWrapper isSmall={isSmall}>
            {!isSearchOpen || !isSmall ? (
              <Logo isSmall={isSmall} />
            ) : null}
            <HeaderSearch
              isSmall={isSmall}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />
            {!isSmall ? (
              <DesktopLocaleChooser />
            ) : null}
            {isSmall && !isSearchOpen ? (
              <MobileNavigationToggleButton isOpen={isExpanded} setIsOpen={setIsExpanded} />
            ) : null}
            {!isSmall ? (
              <DesktopAuthenticationPanel user={user} />
            ) : null}
          </HeaderWrapper>
          {isSmall && isExpanded ? (
            <UserInfo user={user} isSmall />
          ) : null}
        </MarginContainer>
      </HeaderContainer>
    </Block>
  );

  return (
    <>
      {header}

      {!isSmall ? (
        <Block variant="nav">
          <NavigationContainer isSmall={isSmall}>
            <MarginContainer isSmall={isSmall}>
              <DesktopNavigation />
            </MarginContainer>
          </NavigationContainer>
        </Block>
      ) : null}

      <Modal
        isOpen={isSmall && isExpanded}
        onRequestClose={() => setIsExpanded(false)}
        overlayElement={(props, children) => <ModalOverlay {...props}>{children}</ModalOverlay>}
        contentElement={(props, children) => <ModalContent {...props}>{children}</ModalContent>}
        overlayClassName={String(ModalOverlay)}
        className={String(ModalContent)}
      >
        {header}

        <Block variant="nav">
          <NavigationContainer isSmall>
            <MobileNavigation user={user} />
          </NavigationContainer>
        </Block>
      </Modal>
    </>
  );
}
