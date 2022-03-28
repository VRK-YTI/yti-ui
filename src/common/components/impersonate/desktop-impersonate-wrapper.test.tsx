import React from 'react';
import { render, screen } from '@testing-library/react';
import ImpersonateWrapper from './desktop-impersonate-wrapper';
import useFakeableUsers, { UseFakeableUsersResult } from './use-fakeable-users';
import { themeProvider } from '@app/tests/test-utils';

jest.mock('./use-fakeable-users');
const mockedUseFakeableUsers = useFakeableUsers as jest.MockedFunction<
  typeof useFakeableUsers
>;

describe('impersonateWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
      },
    ] as UseFakeableUsersResult[]);

    render(<ImpersonateWrapper>Children</ImpersonateWrapper>, {
      wrapper: themeProvider,
    });

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

    render(<ImpersonateWrapper>Children</ImpersonateWrapper>, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should render children', async () => {
    mockedUseFakeableUsers.mockReturnValue([
      {
        id: '1',
        email: 'admin@localhost',
        displayName: 'Admin User',
      },
    ] as UseFakeableUsersResult[]);

    render(<ImpersonateWrapper>Children</ImpersonateWrapper>, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('should render only children when users were not found', async () => {
    mockedUseFakeableUsers.mockReturnValue([]);

    render(<ImpersonateWrapper>Children</ImpersonateWrapper>, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.queryByText('tr-impersonate-user')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
  });
});
