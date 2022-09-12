import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopAuthenticationPanel from './desktop-authentication-panel';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import { makeStore } from '@app/store';
import { Provider } from 'react-redux';
import { setLogin } from '@app/common/components/login/login.slice';
import { User } from '@app/common/interfaces/user.interface';

describe('authentication panel', () => {
  it('should render login button for unauthenticated user', () => {
    const store = makeStore(getMockContext());
    render(
      <Provider store={store}>
        <DesktopAuthenticationPanel />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-site-login')).toBeInTheDocument();
  });

  it('should render logout button and user info for logged in user', () => {
    const store = makeStore(getMockContext());
    store.dispatch(
      setLogin({
        anonymous: false,
        email: 'admin@localhost',
        firstName: 'Admin',
        lastName: 'User',
      } as User)
    );

    render(
      <Provider store={store}>
        <DesktopAuthenticationPanel />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('tr-site-login')).not.toBeInTheDocument();
    expect(screen.getByText('tr-site-logout')).toBeInTheDocument();
  });
});
