import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopAuthenticationPanel from './desktop-authentication-panel';
import { themeProvider } from '../../utils/test-utils';
import { anonymousUser } from 'interfaces/user.interface';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('authentication panel', () => {
  it('should render login button for unauthenticated user', () => {
    render(<DesktopAuthenticationPanel />, { wrapper: themeProvider });

    expect(screen.getByText('tr-site-login')).toBeInTheDocument();
  });

  it('should render logout button and user info for logged in user', () => {
    const loggedInUser = {
      ...anonymousUser,
      anonymous: false,
      email: 'admin@localhost',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
    };

    render(<DesktopAuthenticationPanel user={loggedInUser} />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('tr-site-login')).not.toBeInTheDocument();
    expect(screen.getByText('tr-site-logout')).toBeInTheDocument();
  });
});
