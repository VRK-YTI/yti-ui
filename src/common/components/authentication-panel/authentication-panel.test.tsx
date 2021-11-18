import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthenticationPanel from './authentication-panel';
import { LayoutProps } from '../../../layouts/layout-props';

describe('Authentication panel', () => {

  test('should render login button for unauthenticated user', () => {

    const props = {
      isSmall: false
    } as LayoutProps;

    render(
      <AuthenticationPanel props={props} />
    );

    expect(screen.queryByText('tr-site-login')).toBeTruthy();
  });

  test('should render logout button and user info for logged in user', () => {
    const props = {
      isSmall: false,
      user: {
        anonymous: false,
        email: 'admin@localhost',
        firstName: 'Admin',
        lastName: 'User'
      }
    } as LayoutProps;

    render(
      <AuthenticationPanel props={props} />
    );

    expect(screen.queryByText('Admin User')).toBeTruthy();
    expect(screen.queryByText('tr-site-login')).toBeFalsy();
    expect(screen.queryByText('tr-site-logout'.toUpperCase())).toBeTruthy();
  });

});
