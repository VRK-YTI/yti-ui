import React, { useState } from 'react';
import { Block } from 'suomifi-ui-components';
import Modal from 'react-modal';
import {
  NavigationContainer,
} from '../layout/layout.styles';
import Logo from './logo';
import MobileNavigationToggleButton from './mobile-navigation-toggle-button';
import {
  HeaderWrapper,
  ModalOverlay,
  ModalContent,
  FlexItemBlock
} from './smart-header.styles';
import MobileNavigation from 'yti-common-ui/navigation/mobile-navigation';
import DesktopLocaleChooser from 'yti-common-ui/locale-chooser/desktop-locale-chooser';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import SearchBar from 'src/modules/search/search-bar';
import { useRouter } from 'next/router';
import UserInfo from '@app/common/components/authentication-panel/user-info';
import DesktopAuthenticationPanel from '@app/common/components/authentication-panel/desktop-authentication-panel';
import LoginModalView from '@app/common/components/login-modal';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

export default function SmartHeader({
  user,
  fakeableUsers,
  fullScreenElements,
}: {
  user?: MscrUser;
  fakeableUsers?: FakeableUser[];
  fullScreenElements?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginExpanded, setIsLoginExpanded] = useState(false);
  const { breakpoint, isSmall } = useBreakpoints();
  const router = useRouter();

  Modal.setAppElement('#__next');

  const handleLoginModalClick = () => {
    setIsLoginExpanded(true);
    setIsExpanded(false);
  };

  if (user?.anonymous && (router.asPath == '/' || router.asPath == '/401')) {
    return <>{renderLandingHeader()}</>;
  }

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
      {/* {renderMobileNavigationModal()} */}
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

  function renderHeader() {
    return (
      <FlexItemBlock variant="header" role="banner" id="top-header">
        <HeaderWrapper $breakpoint={breakpoint}>
          {renderLogo()}
          {renderHeaderSearch()}
          {/*renderDesktopLocaleChooser()*/}
          {renderMobileNavigationToggleButton()}
          {renderDesktopAuthenticationPanel()}
        </HeaderWrapper>
        {renderUserInfo()}
      </FlexItemBlock>
    );
  }

  function renderLandingHeader() {
    return (
      <Block variant="header" role="banner" id="top-header">
        <HeaderWrapper $breakpoint={breakpoint}>
          {renderLogo()}
          {renderDesktopAuthenticationPanel()}
        </HeaderWrapper>
      </Block>
    );
  }

  function renderFullScreenHeader() {
    return (
      <Block variant="header" role="banner" id="top-header">
        <HeaderWrapper
          $breakpoint={breakpoint}
          $fullHeight={typeof fullScreenElements !== 'undefined'}
        >
          {fullScreenElements}
          <div
            style={{ display: 'flex', padding: '20px 20px 0 0', gap: '10px' }}
          >
            {/*renderDesktopLocaleChooser()*/}
            {renderMobileNavigationToggleButton()}
            {renderDesktopAuthenticationPanel()}
          </div>
        </HeaderWrapper>
        {renderUserInfo()}
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
      <SearchBar hideLabel={true}/>
      // <HeaderSearch
      //   isSearchOpen={isSearchOpen}
      //   setIsSearchOpen={setIsSearchOpen}
      // />
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
    // console.log(user, fakeableUsers);
    if (!isSmall) {
      return (
        <DesktopAuthenticationPanel user={user} fakeableUsers={fakeableUsers} />
      );
    }
  }

  function renderUserInfo() {
    // console.log(user);
    if (isSmall && isExpanded) {
      return <UserInfo breakpoint="small" user={user} />;
    }
  }

  function renderLoginModal() {
    // console.log(user);

    return isLoginExpanded ? (
      <LoginModalView setVisible={setIsLoginExpanded} />
    ) : (
      <></>
    );
  }
}
