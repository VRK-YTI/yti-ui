import React from 'react';
import { render, screen } from '@testing-library/react';
import { themeProvider } from 'yti-common-ui/utils/test-utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarLinkList,
  SidebarLinkListItem,
} from '.';

describe('sidebar', () => {
  it('should render', () => {
    render(
      <Sidebar>
        <SidebarHeader>This is sidebar</SidebarHeader>
      </Sidebar>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('This is sidebar')).toBeInTheDocument();
  });

  it('should render links', () => {
    render(
      <Sidebar>
        <SidebarLinkList>
          <SidebarLinkListItem>
            <a href="#1">Link 1</a>
          </SidebarLinkListItem>
          <SidebarLinkListItem>
            <a href="#2">Link 2</a>
          </SidebarLinkListItem>
        </SidebarLinkList>
      </Sidebar>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });
});
