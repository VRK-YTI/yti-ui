import React, { useState } from 'react';
import { Block } from 'suomifi-ui-components';
import Modal from 'react-modal';
import {
  HeaderContainer,
  MarginContainer,
  NavigationContainer,
} from '../layout/layout.styles';
import Logo from './logo';
import MobileNavigationToggleButton from './mobile-navigation-toggle-button';
import {
  HeaderWrapper,
  ModalOverlay,
  ModalContent,
} from './smart-header.styles';
import DesktopAuthenticationPanel from '../authentication-panel/desktop-authentication-panel';
import DesktopNavigation from '../navigation/desktop-navigation';
import MobileNavigation from '../navigation/mobile-navigation';
import DesktopLocaleChooser from '../locale-chooser/desktop-locale-chooser';
import UserInfo from '../authentication-panel/user-info';
import HeaderSearch from '../header-search';
import { useBreakpoints } from '../media-query';
import LoginModalView from '../login-modal';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import { User } from '../../interfaces/user.interface';

export default function SmartHeader({
  user,
  fakeableUsers,
  fullScreenElements,
}: {
  user?: User;
  fakeableUsers?: FakeableUser[];
  fullScreenElements?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginExpanded, setIsLoginExpanded] = useState(false);
  const { breakpoint, isSmall } = useBreakpoints();

  Modal.setAppElement('#__next');

  const handleLoginModalClick = () => {
    setIsLoginExpanded(true);
    setIsExpanded(false);
  };

  if (fullScreenElements) {
    return (
      <>
        {renderFullScreenHeader()}
        {renderMobileNavigationModal()}
        {renderLoginModal()}
      </>
    );
  }

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
          <MobileNavigation
            handleLoginModalClick={handleLoginModalClick}
            isLoggedIn={!user?.anonymous ?? false}
            fakeableUsers={fakeableUsers}
          />
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
              <DesktopNavigation isLoggedIn={!user?.anonymous ?? false} />
            </MarginContainer>
          </NavigationContainer>
        </Block>
      );
    }
  }

  function renderHeader() {
    return (
      <Block variant="header" role="banner" id="top-header">
        <HeaderContainer>
          <MarginContainer $breakpoint={breakpoint}>
            <HeaderWrapper $breakpoint={breakpoint}>
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

  function renderFullScreenHeader() {
    return (
      <Block variant="header" role="banner" id="top-header">
        <HeaderContainer $noBorder={typeof fullScreenElements !== 'undefined'}>
          <HeaderWrapper
            $breakpoint={breakpoint}
            $fullHeight={typeof fullScreenElements !== 'undefined'}
          >
            {fullScreenElements}
            <div
              style={{ display: 'flex', padding: '20px 20px 0 0', gap: '10px' }}
            >
              {renderDesktopLocaleChooser()}
              {renderMobileNavigationToggleButton()}
              {renderDesktopAuthenticationPanel()}
            </div>
          </HeaderWrapper>
          {renderUserInfo()}
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
      return (
        <DesktopLocaleChooser
          noFlex={typeof fullScreenElements !== 'undefined'}
        />
      );
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
      return (
        <DesktopAuthenticationPanel user={user} fakeableUsers={fakeableUsers} />
      );
    }
  }

  function renderUserInfo() {
    if (isSmall && isExpanded) {
      return <UserInfo breakpoint="small" user={user} />;
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
