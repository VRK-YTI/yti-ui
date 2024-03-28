import Link from 'next/link';
import { RouterLink } from 'suomifi-ui-components';
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
  MscrSideNavigationLevel1,
} from './side-navigation.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import getOrganizations from '@app/common/utils/get-organizations';

export default function SideNavigationPanel({ user }: { user?: MscrUser }) {
  const { breakpoint } = useBreakpoints();
  const { t } = useTranslation('common');
  const [openGroup, setOpenGroup] = useState('');
  const router = useRouter();
  const lang = router.locale ?? '';
  // Paths for now
  const personalSchemasPath = '/personal/schemas';
  const personalCrosswalksPath = '/personal/crosswalks';
  const personalSettingsPath = '/personal/settings';
  // Group settings path is form '/' + group.id + '/settings'
  const organizations = getOrganizations(user?.organizations, lang);

  return (
    <SideNavigationWrapper $breakpoint={breakpoint} id="sidebar">
      <MscrSideNavigation heading="" aria-label={t('workspace.navigation')}>
        <MscrSideNavigationLevel1
          subLevel={1}
          expanded
          content={
            <NavigationHeading variant="h2">
              {t('workspace.personal')}
            </NavigationHeading>
          }
        >
          <PersonalNavigationWrapper>
            <MscrSideNavigationLevel3
              className="personal"
              subLevel={3}
              selected={router.asPath.startsWith(personalSchemasPath)}
              content={
                <Link href={personalSchemasPath} passHref>
                  <RouterLink onClick={() => setOpenGroup('')}>
                    {t('workspace.schemas')}
                  </RouterLink>
                </Link>
              }
            />
            <MscrSideNavigationLevel3
              className="personal"
              subLevel={3}
              selected={router.asPath.startsWith(personalCrosswalksPath)}
              content={
                <Link href={personalCrosswalksPath} passHref>
                  <RouterLink onClick={() => setOpenGroup('')}>
                    {t('workspace.crosswalks')}
                  </RouterLink>
                </Link>
              }
            />
            <MscrSideNavigationLevel3
              className="personal"
              subLevel={3}
              selected={router.asPath.startsWith(personalSettingsPath)}
              content={''}
              // content={
              //   <Link href={personalSettingsPath} passHref>
              //     <RouterLink onClick={() => setOpenGroup('')}>
              //       {t('workspace-navigation-settings')}
              //     </RouterLink>
              //   </Link>
              // }
            />
          </PersonalNavigationWrapper>
        </MscrSideNavigationLevel1>
        <MscrSideNavigationLevel1
          subLevel={1}
          expanded
          content={
            <NavigationHeading variant="h2">
              {t('workspace.group')}
            </NavigationHeading>
          }
        >
          {organizations?.map((group) => (
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
                  <GroupHeading variant="h3">{group.label}</GroupHeading>
                </RouterLink>
              }
            >
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith('/' + group.id + '/schemas')}
                content={
                  <Link href={'/' + group.id + '/schemas'} passHref>
                    <RouterLink>{t('workspace.schemas')}</RouterLink>
                  </Link>
                }
              />
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith('/' + group.id + '/crosswalks')}
                content={
                  <Link href={'/' + group.id + '/crosswalks'} passHref>
                    <RouterLink>{t('workspace.crosswalks')}</RouterLink>
                  </Link>
                }
              />
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith('/' + group.id + '/settings')}
                content={''}
                // content={
                //   <Link href={'/' + group.id + '/settings'} passHref>
                //     <RouterLink>
                //       {t('workspace-group-navigation-settings')}
                //     </RouterLink>
                //   </Link>
                // }
              />
            </MscrSideNavigationLevel2>
          ))}
        </MscrSideNavigationLevel1>
      </MscrSideNavigation>
    </SideNavigationWrapper>
  );
}
