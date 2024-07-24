import Link from 'next/link';
import { Heading, RouterLink } from 'suomifi-ui-components';
import { IconChevronDown, IconChevronUp } from 'suomifi-icons';
import { useBreakpoints } from 'yti-common-ui/media-query';
import Tooltip from '@mui/material/Tooltip';
import {
  NavigationHeading,
  SideNavigationWrapper,
  MscrSideNavigationLevel2,
  MscrSideNavigationLevel3,
  PersonalNavigationWrapper,
  MscrSideNavigation,
  MscrSideNavigationLevel1,
  GroupButton,
  ExpanderButton,
  CollapsedNavigationWrapper,
  PersonalNavButton,
  ExpanderIcon,
  GroupNavIcon,
  CollapsedGroupItem,
  CollapsedGroupList,
} from './side-navigation.styles';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import getOrganizations from '@app/common/utils/get-organizations';
import { SearchContext } from '@app/common/components/search-context-provider';

export default function SideNavigationPanel({ user }: { user?: MscrUser }) {
  const { breakpoint } = useBreakpoints();
  const { t } = useTranslation('common');
  const { setIsSearchActive } = useContext(SearchContext);
  const router = useRouter();
  const lang = router.locale ?? '';
  const [openGroup, setOpenGroup] = useState([
    router.query['homepage']?.toString() ?? '',
  ]);
  // Paths for now
  const personalSchemasPath = '/personal/schemas';
  const personalCrosswalksPath = '/personal/crosswalks';
  const personalSettingsPath = '/personal/settings';
  // Group settings path is form '/' + group.id + '/settings'
  const organizations = getOrganizations(user?.organizations, lang);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);
  const [isFirstPageLoad, setFirstPageLoad] = useState(true);

  function sidebarFoldButtonClick() {
    //console.log('is folded', isSidebarFolded);
    setSidebarMinimized(!isSidebarMinimized);
    setFirstPageLoad(false);
  }
  // ToDo: Remove
  organizations.push({
    id: 'whateverererereer',
    label: 'Diligent professionals',
  });

  const handleClickGroup = (groupId: string) => {
    if (router.asPath.startsWith('/' + groupId)) {
      return;
    }
    if (openGroup.includes(groupId)) {
      const newOpenGroup = openGroup.filter((id) => id !== groupId);
      setOpenGroup(newOpenGroup);
      return;
    } else {
      setOpenGroup(openGroup.concat([groupId]));
    }
  };

  const expandedMenu = () => {
    return (
      <MscrSideNavigation
        $isSidebarFolded={isSidebarMinimized}
        heading=""
        aria-label={t('workspace.navigation')}
        className={
          !isSidebarMinimized && !isFirstPageLoad
            ? 'sidebar-animate-fadein'
            : isSidebarMinimized
              ? 'sidebar-animate-fadeout'
              : undefined
        }
      >
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
              selected={router.asPath.startsWith(personalCrosswalksPath)}
              content={
                <Link href={personalCrosswalksPath} passHref>
                  <RouterLink
                    onClick={() => {
                      setOpenGroup([]);
                      setIsSearchActive(false);
                    }}
                  >
                    {t('workspace.crosswalks')}
                  </RouterLink>
                </Link>
              }
            />
            <MscrSideNavigationLevel3
              className="personal"
              subLevel={3}
              selected={router.asPath.startsWith(personalSchemasPath)}
              content={
                <Link href={personalSchemasPath} passHref>
                  <RouterLink
                    onClick={() => {
                      setOpenGroup([]);
                      setIsSearchActive(false);
                    }}
                  >
                    {t('workspace.schemas')}
                  </RouterLink>
                </Link>
              }
            />
            <MscrSideNavigationLevel3
              className="personal"
              subLevel={3}
              selected={router.asPath.startsWith(personalSettingsPath)}
              content={''}
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
              selected={openGroup.includes(group.id)}
              className={openGroup.includes(group.id) ? 'group-selected' : ''}
              content={
                <GroupButton onClick={() => handleClickGroup(group.id)}>
                  <Heading variant="h3">{group.label}</Heading>
                  {openGroup.includes(group.id) && <IconChevronUp />}
                  {!openGroup.includes(group.id) && <IconChevronDown />}
                </GroupButton>
              }
            >
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith(
                  '/' + group.id + '/crosswalks'
                )}
                content={
                  <Link href={'/' + group.id + '/crosswalks'} passHref>
                    <RouterLink onClick={() => setIsSearchActive(false)}>
                      {t('workspace.crosswalks')}
                    </RouterLink>
                  </Link>
                }
              />
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith('/' + group.id + '/schemas')}
                content={
                  <Link href={'/' + group.id + '/schemas'} passHref>
                    <RouterLink onClick={() => setIsSearchActive(false)}>
                      {t('workspace.schemas')}
                    </RouterLink>
                  </Link>
                }
              />
              <MscrSideNavigationLevel3
                className="group"
                subLevel={3}
                selected={router.asPath.startsWith(
                  '/' + group.id + '/settings'
                )}
                content={''}
              />
            </MscrSideNavigationLevel2>
          ))}
        </MscrSideNavigationLevel1>
      </MscrSideNavigation>
    );
  };

  const collapsedMenu = () => {
    return (
      <CollapsedNavigationWrapper
        className={
          isSidebarMinimized
            ? 'sidebar-animate-fadein'
            : 'sidebar-animate-fadeout'
        }
      >
        <PersonalNavButton>
          <p>
            P<IconChevronDown />
          </p>
        </PersonalNavButton>
        <GroupNavIcon>
          <p>G</p>
        </GroupNavIcon>
        <CollapsedGroupList>
          {organizations.map((group) => (
            <CollapsedGroupItem key={group.id}>
              <GroupButton
                className={'collapsed'}
                onClick={() => {
                  return; // Avaa popup-menu
                }}
              >
                <Heading variant="h3">
                  {group.label.substring(0, 2).toUpperCase()}
                </Heading>
                {openGroup.includes(group.id) && <IconChevronUp />}
                {!openGroup.includes(group.id) && <IconChevronDown />}
              </GroupButton>
            </CollapsedGroupItem>
          ))}
        </CollapsedGroupList>
      </CollapsedNavigationWrapper>
    );
  };

  return (
    <SideNavigationWrapper
      $breakpoint={breakpoint}
      $isSidebarFolded={isSidebarMinimized}
      id="sidebar"
    >
      {isSidebarMinimized && collapsedMenu()}
      {!isSidebarMinimized && expandedMenu()}

      {/*<div className={'d-flex justify-content-between'}>*/}

      {/*<div className={''}>*/}
      {/*  <div*/}
      {/*    className={*/}
      {/*      !isSidebarMinimized && !isFirstPageLoad*/}
      {/*        ? 'sidebar-animate-fadein'*/}
      {/*        : undefined*/}
      {/*    }*/}
      {/*  >*/}
      {/*    */}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<FoldButtonWrapper*/}
      {/*  className={'col-1 d-flex justify-content-center flex-column'}*/}
      {/*>*/}
      {/*  <Tooltip*/}
      {/*    title={*/}
      {/*      isSidebarMinimized*/}
      {/*        ? t('click-to-expand-sidebar')*/}
      {/*        : t('click-to-minimize-sidebar')*/}
      {/*    }*/}
      {/*    placement="top-end"*/}
      {/*    className={undefined}*/}
      {/*  >*/}
      {/*    <FoldButton*/}
      {/*      aria-label="fold"*/}
      {/*      onClick={(e) => {*/}
      {/*        sidebarFoldButtonClick();*/}
      {/*        e.stopPropagation();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <div></div>*/}
      {/*      <div></div>*/}
      {/*    </FoldButton>*/}
      {/*  </Tooltip>*/}
      {/*</FoldButtonWrapper>*/}
      {/*</div>*/}
      <Tooltip
        title={
          isSidebarMinimized
            ? t('click-to-expand-sidebar')
            : t('click-to-minimize-sidebar')
        }
        placement="right"
        className={undefined}
      >
        <ExpanderButton onClick={() => sidebarFoldButtonClick()}>
          <ExpanderIcon />
        </ExpanderButton>
      </Tooltip>
    </SideNavigationWrapper>
  );
}
