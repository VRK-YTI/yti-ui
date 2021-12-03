import React from 'react';
import { render, screen } from '@testing-library/react';
import ImpersonateWrapper from './desktop-impersonate-wrapper';
import useFakeableUsers from './use-fakeable-users';
import { themeProvider } from '../../../tests/test-utils';

jest.mock('./use-fakeable-users');
const mockedUseFakeableUsers = useFakeableUsers as jest.MockedFunction<typeof useFakeableUsers>;

describe('ImpersonateWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([{ id: '1', email: 'admin@localhost', displayName: 'Admin User', impersonate: () => {} }]);

    render(
      <ImpersonateWrapper>
        Children
      </ImpersonateWrapper>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('tr-impersonate-user')).toBeTruthy();
  });

  it('should show "Admin User" text', async () => {
    mockedUseFakeableUsers.mockReturnValue([{ id: '1', email: 'admin@localhost', displayName: 'Admin User', impersonate: () => {} }]);

    render(
      <ImpersonateWrapper>
        Children
      </ImpersonateWrapper>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('Admin User')).toBeTruthy();
  });

  it('should render children', async () => {
    mockedUseFakeableUsers.mockReturnValue([{ id: '1', email: 'admin@localhost', displayName: 'Admin User', impersonate: () => {} }]);

    render(
      <ImpersonateWrapper>
        Children
      </ImpersonateWrapper>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('Children')).toBeTruthy();
  });

  it('should render only children when users were not found', async () => {
    mockedUseFakeableUsers.mockReturnValue([]);

    render(
      <ImpersonateWrapper>
        Children
      </ImpersonateWrapper>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('Children')).toBeTruthy();
    expect(screen.queryByText('tr-impersonate-user')).toBeFalsy();
    expect(screen.queryByText('Admin User')).toBeFalsy();
  });
});
