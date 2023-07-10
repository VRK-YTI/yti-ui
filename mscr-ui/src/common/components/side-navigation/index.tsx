import {
  RouterLink,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';

export default function SideNavigationPanel({}) {
  return (
    // <SideNavigation heading="Workspaces" aria-label="main">
    //   <SideNavigationItem
    //     subLevel={1}
    //     content={<RouterLink href="/">Personal workspace</RouterLink>}
    //   >
    //     <SideNavigationItem
    //       subLevel={2}
    //       content={
    //         <RouterLink href="/">
    //           Crisis situations in personal finances
    //         </RouterLink>
    //       }
    //     >
    //       <SideNavigationItem
    //         subLevel={3}
    //         content={
    //           <RouterLink href="/">
    //             Cisis situations in personal finances
    //           </RouterLink>
    //         }
    //       />
    //     </SideNavigationItem>
    //   </SideNavigationItem>
    // </SideNavigation>
    <SideNavigation heading="Workspaces" aria-label="Main">
      <SideNavigationItem
        subLevel={1}
        content={<RouterLink href="/">Personal workspace</RouterLink>}
      >
        <SideNavigationItem
          subLevel={2}
          content={<RouterLink href="/">Tim's workspace</RouterLink>}
        >
          <SideNavigationItem
            subLevel={3}
            selected
            content={<RouterLink href="/">Workspace content</RouterLink>}
          />
          <SideNavigationItem
            subLevel={3}
            content={<RouterLink href="/">Workspace settings</RouterLink>}
          />
        </SideNavigationItem>
      </SideNavigationItem>
      <SideNavigationItem
        subLevel={1}
        content={<RouterLink href="/">Group workspace</RouterLink>}
      >
        <SideNavigationItem
          subLevel={2}
          selected
          content={<RouterLink href="/">Dilligent professionals</RouterLink>}
        />
        <SideNavigationItem
          subLevel={2}
          content={<RouterLink href="/">Science 4 ever</RouterLink>}
        />
      </SideNavigationItem>
    </SideNavigation>
  );
}
