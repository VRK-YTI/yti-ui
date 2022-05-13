import React, { useState } from 'react';
import { Block } from 'suomifi-ui-components';
import Modal from 'react-modal';
import {
  HeaderContainer,
  MarginContainer,
  NavigationContainer,
} from '@app/layouts/layout.styles';
import Logo from './logo';
import MobileNavigationToggleButton from './mobile-navigation-toggle-button';
import {
  HeaderWrapper,
  ModalOverlay,
  ModalContent,
} from './smart-header.styles';
import DesktopAuthenticationPanel from '@app/common/components/authentication-panel/desktop-authentication-panel';
import DesktopNavigation from '@app/common/components/navigation/desktop-navigation';
import MobileNavigation from '@app/common/components/navigation/mobile-navigation';
import DesktopLocaleChooser from '@app/common/components/locale-chooser/desktop-locale-chooser';
import UserInfo from '@app/common/components/authentication-panel/user-info';
import HeaderSearch from '@app/common/components/header-search/header-search';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import LoginModalView from '@app/common/components/login-modal/login-modal';

export default function SmartHeader() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginExpanded, setIsLoginExpanded] = useState(false);
  const { breakpoint, isSmall } = useBreakpoints();

  Modal.setAppElement('#__next');

  const handleLoginModalClick = () => {
    setIsLoginExpanded(true);
    setIsExpanded(false);
  };

  return (
    <>
      {renderHeader()}
      {renderDesktopNavigation()}
      {renderMobileNavigationModal()}
      {renderLoginModal()}
    </>
  );

  function renderMobileNavigationModal() {
    return (
      <Modal
        isOpen={isSmall && isExpanded}
        onRequestClose={() => setIsExpanded(false)}
        overlayElement={(props, children) => (
          <ModalOverlay {...props}>{children}</ModalOverlay>
        )}
        contentElement={(props, children) => (
          <ModalContent {...props}>{children}</ModalContent>
        )}
        overlayClassName={String(ModalOverlay)}
        className={String(ModalContent)}
      >
        {renderHeader()}
        {renderMobileNavigation()}
      </Modal>
    );
  }

  function renderMobileNavigation() {
    return (
      <Block variant="nav">
        <NavigationContainer $breakpoint="small">
          <MobileNavigation handleLoginModalClick={handleLoginModalClick} />
        </NavigationContainer>
      </Block>
    );
  }

  function renderDesktopNavigation() {
    if (!isSmall) {
      return (
        <Block variant="nav">
          <NavigationContainer $breakpoint={breakpoint}>
            <MarginContainer $breakpoint={breakpoint}>
              <DesktopNavigation />
            </MarginContainer>
          </NavigationContainer>
        </Block>
      );
    }
  }

  function renderHeader() {
    return (
      <Block variant="header" role="banner">
        <HeaderContainer>
          <MarginContainer $breakpoint={breakpoint}>
            <HeaderWrapper $breakpoint={breakpoint}>
              {renderLogo()}
              {renderHeaderSearch()}
              {renderDesktopLocaleChooser()}
              {renderMobileNavigationToggleButton()}
              {renderDesktopAuthenticationPanel()}
            </HeaderWrapper>
            {renderUserInfo()}
          </MarginContainer>
        </HeaderContainer>
      </Block>
    );
  }

  function renderLogo() {
    if (!isSearchOpen || !isSmall) {
      return <Logo />;
    }
  }

  function renderHeaderSearch() {
    return (
      <HeaderSearch
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    );
  }

  function renderDesktopLocaleChooser() {
    if (!isSmall) {
      return <DesktopLocaleChooser />;
    }
  }

  function renderMobileNavigationToggleButton() {
    if (isSmall && !isSearchOpen) {
      return (
        <MobileNavigationToggleButton
          isOpen={isExpanded}
          setIsOpen={setIsExpanded}
        />
      );
    }
  }

  function renderDesktopAuthenticationPanel() {
    if (!isSmall) {
      return <DesktopAuthenticationPanel />;
    }
  }

  function renderUserInfo() {
    if (isSmall && isExpanded) {
      return <UserInfo breakpoint="small" />;
    }
  }

  function renderLoginModal() {
    return isLoginExpanded ? (
      <LoginModalView setVisible={setIsLoginExpanded} />
    ) : (
      <></>
    );
  }
}
