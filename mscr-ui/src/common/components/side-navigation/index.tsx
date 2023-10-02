import { Link as MUILink } from '@mui/material';
import Link from 'next/link';
import {
  Button,
  RouterLink,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  NavigationHeading,
  SideNavigationWrapper,
  MscrSideNavigationLevel2,
  MscrSideNavigationLevel3,
  PersonalNavigationWrapper,
  MscrSideNavigation,
  GroupHeading,
  GroupOpenButton,
  MscrSideNavigationLevel1
} from './side-navigation.styles';
import {useTranslation} from 'next-i18next';
import {useState} from 'react';
import {useRouter} from 'next/router';

export default function SideNavigationPanel({ user }: { user?: User }) {
  const groups = user?.organizations;
  const { breakpoint } = useBreakpoints();
  const { t } = useTranslation('common');
  // Here should be a collection of selectedness states for each workspace that gets rendered
  const [ openGroup, setOpenGroup ] = useState('');
  const router = useRouter();
  console.log(router.asPath);
  const personalContentSlug = 'homepage';
  const personalSettingsSlug = 'settings';
  const groupContentSlug = 'group-home';

  return (
    <SideNavigationWrapper $breakpoint={breakpoint} id="sidebar">
      <MscrSideNavigation
        heading=""
        aria-label={t('workspace-navigation')}
      >
        <MscrSideNavigationLevel1
          subLevel={1}
          expanded
          content={<NavigationHeading variant="h2">Personal workspace</NavigationHeading>}
        >
          <PersonalNavigationWrapper>
            <MscrSideNavigationLevel3
              subLevel={3}
              selected = {router.query.homepage == personalContentSlug} // The correct pathname for personal workspace content here
              content={
                // This is how the links should be once the target pages exist
                <Link href={'/' + personalContentSlug} passHref>
                  <RouterLink
                    onClick={() => setOpenGroup('')}
                  >
                    {t('workspace-navigation-content')}
                  </RouterLink>
                </Link>
              }
            />
            <MscrSideNavigationLevel3
              subLevel={3}
              selected = {router.query.homepage == personalSettingsSlug}
              content={
                <Link href={'/' + personalSettingsSlug} passHref>
                  <RouterLink
                    onClick={() => setOpenGroup('')}
                  >
                    {t('workspace-navigation-settings')}
                  </RouterLink>
                </Link>
              }
            />
          </PersonalNavigationWrapper>
        </MscrSideNavigationLevel1>
        <MscrSideNavigationLevel1
          subLevel={1}
          expanded
          content={<NavigationHeading variant="h2">Group workspace</NavigationHeading>}
        >
          {groups?.map(group =>
            <MscrSideNavigationLevel2
              key={group.id}
              subLevel={2}
              selected={openGroup == group.id}
              content={
                <RouterLink
                  // Button opens the children that are links to content
                  asComponent={GroupOpenButton}
                  onClick={() => {
                    if (openGroup == group.id) {
                      setOpenGroup('');
                      return;
                    }
                    setOpenGroup(group.id);
                  }}
                >
                  <GroupHeading variant="h3">
                    {group.name}
                  </GroupHeading>
                </RouterLink>
              }
            >
              <MscrSideNavigationLevel3
                subLevel={3}
                selected={router.asPath == '/group-home'}
                content={
                  <Link href={'/' + groupContentSlug} passHref>
                    <RouterLink>
                      {t('workspace-navigation-content')}
                    </RouterLink>
                  </Link>
                }
              />
              <MscrSideNavigationLevel3
                subLevel={3}
                selected={router.pathname == group.id + 'settings'}
                content={
                  <RouterLink href={group.id + 'settings'}>
                    {t('workspace-navigation-settings')}
                  </RouterLink>
                }
              />
            </MscrSideNavigationLevel2>
          )}
        </MscrSideNavigationLevel1>
      </MscrSideNavigation>
    </SideNavigationWrapper>
  );
}
