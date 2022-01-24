import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopAuthenticationPanel from './desktop-authentication-panel';
import { themeProvider } from '../../../tests/test-utils';
import { makeStore } from '../../../store';
import { Provider } from 'react-redux';
import { setLogin } from '../login/login-slice';

describe('Authentication panel', () => {
  test('should render login button for unauthenticated user', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <DesktopAuthenticationPanel />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('tr-site-login')).toBeTruthy();
  });

  test('should render logout button and user info for logged in user', () => {
    const store = makeStore();
    store.dispatch(setLogin({
      anonymous: false,
      email: 'admin@localhost',
      firstName: 'Admin',
      lastName: 'User'
    }));

    render(
      <Provider store={store}>
        <DesktopAuthenticationPanel/>
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('Admin User')).toBeTruthy();
    expect(screen.queryByText('tr-site-login')).toBeFalsy();
    expect(screen.queryByText('tr-site-logout')).toBeTruthy();
  });

});
