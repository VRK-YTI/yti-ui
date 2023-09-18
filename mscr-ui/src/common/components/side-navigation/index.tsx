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
import { NavigationHeading, SideNavigationWrapper, MscrSideNavigationLevel2, MscrSideNavigationLevel3, PersonalNavigationWrapper } from './side-navigation.styles';
import {useTranslation} from 'next-i18next';
import {useState} from 'react';

export default function SideNavigationPanel({ user }: { user?: User }) {
  const { breakpoint } = useBreakpoints();
  const { t } = useTranslation('common');
  // Here should be a collection of selectedness states for each workspace that gets rendered
  const [ selected, setSelected ] = useState(false);
  return (
    <SideNavigationWrapper $breakpoint={breakpoint} id="sidebar">
      <SideNavigation
        heading=""
        aria-label={t('workspace-navigation')}
      >
        <SideNavigationItem
          subLevel={1}
          expanded
          content={<NavigationHeading variant="h2">Personal workspace</NavigationHeading>}
        >
          <PersonalNavigationWrapper>
            <MscrSideNavigationLevel3
              subLevel={3}
              selected
              content={
                <RouterLink href="/personal-home">
                    {t('workspace-navigation-content')}
                </RouterLink>
              }
            />
            <MscrSideNavigationLevel3
              subLevel={3}
              content={
                <RouterLink href="/personal-home">
                    {t('workspace-navigation-settings')}
                </RouterLink>
              }
            />
          </PersonalNavigationWrapper>
        </SideNavigationItem>
        <SideNavigationItem
          subLevel={1}
          expanded
          content={<NavigationHeading variant="h2">Group workspace</NavigationHeading>}
        >
          <MscrSideNavigationLevel2
            subLevel={2}
            selected={selected}
            content={
              <RouterLink
                // Button opens the children that are links to content
                asComponent={Button}
                onClick={() => setSelected(!selected)}
              >
                Dilligent professionals
              </RouterLink>
            }
          >
            <MscrSideNavigationLevel3
              subLevel={3}
              content={
                <RouterLink href="/personal-home">
                    {t('workspace-navigation-content')}
                </RouterLink>
              }
            />
            <MscrSideNavigationLevel3
              subLevel={3}
              content={
                <RouterLink href="/personal-home">
                    {t('workspace-navigation-settings')}
                </RouterLink>
              }
            />
          </MscrSideNavigationLevel2>
          <MscrSideNavigationLevel2
            subLevel={2}
            expanded
            content={<RouterLink href="/group-home">Science 4 ever</RouterLink>}
          />
        </SideNavigationItem>
      </SideNavigation>
    </SideNavigationWrapper>
  );
}
