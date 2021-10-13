import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthenticationPanel from './authentication-panel';
import { LayoutProps } from '../layout/layout-props';

describe('Authentication panel', () => {

  test('should render login button for unauthenticated user', () => {

    const props = {
      isSmall: false
    } as LayoutProps;

    render(
      <AuthenticationPanel props={props} />
    );

    expect(screen.queryByText('Kirjaudu')).toBeTruthy();
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
    expect(screen.queryByText('KIRJAUDU ULOS')).toBeTruthy();
  });

});
