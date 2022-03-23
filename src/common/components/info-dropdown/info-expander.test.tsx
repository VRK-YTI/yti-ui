/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoExpander from './info-expander';
import { themeProvider } from '../../../tests/test-utils';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';
import { setLogin, initialState } from '../login/login-slice';

describe('infoExpander', () => {
  it('should render export button', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <InfoExpander data={{
          properties: {},
          references: {
            contributor: [{ properties: { prefLabel: [] } }],
            inGroup: [{ properties: { prefLabel: [] } }],
          },
        } as any}
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText('tr-vocabulary-info-vocabulary-export')
    ).toBeInTheDocument();
  });

  it('should render subscribe button', () => {
    const store = makeStore();
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['anonymous'] = false;
    loginInitialState['email'] = 'admin@localhost';
    loginInitialState['firstName'] = 'Admin';
    loginInitialState['lastName'] = 'User';
    store.dispatch(setLogin(loginInitialState));

    render(
      <Provider store={store}>
        <InfoExpander data={{
          properties: {},
          references: {
            contributor: [{ properties: { prefLabel: [] } }],
            inGroup: [{ properties: { prefLabel: [] } }],
          },
        } as any}
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-email-subscription-add')).toBeInTheDocument();
  });
});
