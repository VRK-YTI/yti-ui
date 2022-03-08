import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileImpersonateWrapper from './mobile-impersonate-wrapper';
import useFakeableUsers from './use-fakeable-users';
import { themeProvider } from '../../../tests/test-utils';

jest.mock('./use-fakeable-users');
const mockedUseFakeableUsers = useFakeableUsers as jest.MockedFunction<
  typeof useFakeableUsers
>;

describe('ImpersonateHamburgerMenuWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
        impersonate: () => {},
      },
    ]);

    render(<MobileImpersonateWrapper />, { wrapper: themeProvider });

    expect(screen.queryByText('tr-impersonate-user')).toBeTruthy();
  });

  it('should show "Admin User" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
        impersonate: () => {},
      },
    ]);

    render(<MobileImpersonateWrapper />, { wrapper: themeProvider });

    expect(screen.queryByText('Admin User')).toBeTruthy();
  });

  it('should render null if users were not found', async () => {
    mockedUseFakeableUsers.mockReturnValue([]);

    const { container } = render(<MobileImpersonateWrapper />, {
      wrapper: themeProvider,
    });

    expect(container).toBeEmptyDOMElement();
  });
});
