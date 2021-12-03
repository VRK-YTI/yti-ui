import React, { useState } from 'react';
import { Block } from 'suomifi-ui-components';
import Modal from 'react-modal';
import User from '../../common/interfaces/user-interface';
import { HeaderContainer, MarginContainer, NavigationContainer } from '../../layouts/layout.styles';
import Logo from './logo';
import Search from './search';
import MobileNavigationToggleButton from './mobile-navigation-toggle-button';
import UserMenu from './user-menu';
import { HeaderWrapper, ModalOverlay, ModalContent } from './smart-header.styles';
import DesktopAuthenticationPanel from './desktop-authentication-panel';
import Navigation from '../../common/components/navigation/navigation';
import MobileMenu from './mobile-menu';
import DesktopLanguageChooser from '../../common/components/language-chooser/desktop-language-chooser';

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
            <Search isSmall={isSmall} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            {!isSmall ? (
              <DesktopLanguageChooser />
            ) : null}
            {isSmall && !isSearchOpen ? (
              <MobileNavigationToggleButton isOpen={isExpanded} setIsOpen={setIsExpanded} />
            ) : null}
            {!isSmall ? (
              <DesktopAuthenticationPanel props={{ user, isSmall }} />
            ) : null}
          </HeaderWrapper>
          {isSmall && isExpanded ? (
            <UserMenu user={user} />
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
              <Navigation props={{ user, isSmall }} />
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
            <MobileMenu user={user} />
          </NavigationContainer>
        </Block>
      </Modal>
    </>
  );
}
