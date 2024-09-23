import { ThemeProvider } from 'styled-components';
import { lightTheme } from 'yti-common-ui/theme';
import {
  ContentContainer,
  SiteContainer,
  MarginContainer,
  FlexContainer
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import SmartHeader from '../smart-header';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SkipLink from 'yti-common-ui/skip-link';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import generateFakeableUsers from 'yti-common-ui/utils/generate-impersonate';
import SideNavigationPanel from '../side-navigation';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import SearchScreen from 'src/modules/search/search-screen';
import ActionPanel from '@app/common/components/action-panel';
import useUrlState, { initialUrlState } from '@app/common/utils/hooks/use-url-state';
import { ReactNode } from 'react';

export default function Layout({
  children,
  user,
  fakeableUsers,
  isActionMenu,
  alerts,
}: {
  children: ReactNode;
  user?: MscrUser;
  fakeableUsers?: FakeableUser[] | null;
  isActionMenu?: boolean;
  alerts?: ReactNode;
  fullScreenElements?: ReactNode;
}) {
  const { t, i18n } = useTranslation('common');
  const { breakpoint } = useBreakpoints();
  const { urlState } = useUrlState();
  const showSearchScreen = urlState.q !== initialUrlState.q;

  return (
    <ThemeProvider theme={lightTheme}>
      <SkipLink href="#main">{t('skip-link-main')}</SkipLink>
      <SiteContainer>
        <SmartHeader
          user={user}
          fakeableUsers={generateFakeableUsers(
            i18n.language,
            fakeableUsers
          )}
        />
        {user && !user.anonymous ? (
          <FlexContainer>
            <ContentContainer>
              {alerts && alerts}
              <MarginContainer
                $breakpoint={breakpoint}
                className={showSearchScreen ? 'hidden' : ''}
              >
                <ActionPanel isActionMenu={isActionMenu} />
                {showSearchScreen && <SearchScreen/>}
                {children}
              </MarginContainer>
            </ContentContainer>
            <SideNavigationPanel user={user}/>
          </FlexContainer>
        ) : (
          <ContentContainer className={'w-100'}>
            {alerts && alerts}
            <MarginContainer
              $breakpoint={breakpoint}
              className={showSearchScreen ? 'hidden' : ''}
            >
              <ActionPanel isActionMenu={isActionMenu} />
              {showSearchScreen && <SearchScreen />}
              {children}
            </MarginContainer>
          </ContentContainer>
        )}
      </SiteContainer>
    </ThemeProvider>
  );
}
