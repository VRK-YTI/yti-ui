import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoExpander from './info-expander';
import { themeProvider } from '../../../tests/test-utils';
import { Provider } from 'react-redux';
import { makeStore } from '../../../store';
import { setLogin } from '../login/login-slice';

describe('InfoExpander', () => {
  test('should render export button', () => {
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

    expect(screen.queryAllByText('tr-vocabulary-info-vocabulary-export')).toHaveLength(1);
  });

  test('should render subscribe button', () => {
    const store = makeStore();

    store.dispatch(setLogin({
      anonymous: false,
      email: 'admin@localhost',
      firstName: 'Admin',
      lastName: 'User'
    }));

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

    expect(screen.queryAllByText('tr-email-subscription-add')).toHaveLength(1);
  });
});
