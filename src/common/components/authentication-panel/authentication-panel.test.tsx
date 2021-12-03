import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopAuthenticationPanel from './desktop-authentication-panel';
import User from '../../interfaces/user-interface';

describe('Authentication panel', () => {
  test('should render login button for unauthenticated user', () => {
    render(
      <DesktopAuthenticationPanel />
    );

    expect(screen.queryByText('tr-site-login')).toBeTruthy();
  });

  test('should render logout button and user info for logged in user', () => {
    render(
      <DesktopAuthenticationPanel user={{
        anonymous: false,
        email: 'admin@localhost',
        firstName: 'Admin',
        lastName: 'User'
      } as User} />
    );

    expect(screen.queryByText('Admin User')).toBeTruthy();
    expect(screen.queryByText('tr-site-login')).toBeFalsy();
    expect(screen.queryByText('tr-site-logout')).toBeTruthy();
  });

});
