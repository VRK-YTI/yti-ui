import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileImpersonateWrapper from './mobile-impersonate-wrapper';
import useFakeableUsers, { UseFakeableUsersResult } from './use-fakeable-users';
import { themeProvider } from '@app/tests/test-utils';

jest.mock('./use-fakeable-users');
const mockedUseFakeableUsers = useFakeableUsers as jest.MockedFunction<
  typeof useFakeableUsers
>;

describe('impersonateHamburgerMenuWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
      },
    ] as UseFakeableUsersResult[]);

    render(<MobileImpersonateWrapper />, { wrapper: themeProvider });

    expect(screen.getByText('tr-impersonate-user')).toBeInTheDocument();
  });

  it('should show "Admin User" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
      },
    ] as UseFakeableUsersResult[]);

    render(<MobileImpersonateWrapper />, { wrapper: themeProvider });

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should render null if users were not found', async () => {
    mockedUseFakeableUsers.mockReturnValue([]);

    const { container } = render(<MobileImpersonateWrapper />, {
      wrapper: themeProvider,
    });

    expect(container).toBeEmptyDOMElement();
  });
});
