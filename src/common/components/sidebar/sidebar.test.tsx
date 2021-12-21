import React from 'react';
import { render, screen } from '@testing-library/react';
import { themeProvider } from '../../../tests/test-utils';
import { Sidebar, SidebarHeader, SidebarLinkList, SidebarLinkListItem } from '.';

describe('Sidebar', () => {
  test('should render', () => {
    render(
      <Sidebar>
        <SidebarHeader>This is sidebar</SidebarHeader>
      </Sidebar>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('This is sidebar')).toBeTruthy();
  });

  test('should render links', () => {
    render(
      <Sidebar>
        <SidebarLinkList>
          <SidebarLinkListItem>
            <a href="#">Link 1</a>
          </SidebarLinkListItem>
          <SidebarLinkListItem>
            <a href="#">Link 2</a>
          </SidebarLinkListItem>
        </SidebarLinkList>
      </Sidebar>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('Link 1')).toBeTruthy();
    expect(screen.getByText('Link 2')).toBeTruthy();
  });
});
