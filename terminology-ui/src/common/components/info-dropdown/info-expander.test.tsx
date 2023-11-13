/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import { renderWithProviders } from '@app/tests/test-utils';
import {
  initialState,
  loginApi,
} from '@app/common/components/login/login.slice';
import mockRouter from 'next-router-mock';
import { v4 } from 'uuid';
import { adminControlsSlice } from '../admin-controls/admin-controls.slice';
import { vocabularyApi } from '../vocabulary/vocabulary.slice';
import { subscriptionApi } from '../subscription/subscription.slice';
import { screen, waitFor } from '@testing-library/react';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const reducers = [adminControlsSlice, vocabularyApi, loginApi, subscriptionApi];

describe('infoExpander', () => {
  it('should render export button', async () => {
    mockRouter.setCurrentUrl('/terminology/123-123');

    renderWithProviders(
      <InfoExpander
        data={
          {
            properties: {},
            references: {
              contributor: [{ properties: { prefLabel: [] }, id: v4() }],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any
        }
      />,
      reducers
    );

    await waitFor(() => {
      expect(
        screen.getByText('tr-vocabulary-info-vocabulary-export')
      ).toBeInTheDocument();
    });
  });

  it('should render subscribe button', async () => {
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['anonymous'] = false;
    loginInitialState['email'] = 'admin@localhost';
    loginInitialState['firstName'] = 'Admin';
    loginInitialState['lastName'] = 'User';

    mockRouter.setCurrentUrl('/terminology/123-123');

    renderWithProviders(
      <InfoExpander
        data={
          {
            properties: {},
            references: {
              contributor: [{ properties: { prefLabel: [] }, id: v4() }],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any
        }
      />,
      reducers,
      { preloadedState: { login: loginInitialState } }
    );

    await expect(
      screen.findByText('tr-email-subscription-add')
    ).resolves.toBeInTheDocument();
  });

  it('should render createdBy and modifiedBy when available', async () => {
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['anonymous'] = false;
    loginInitialState['email'] = 'admin@localhost';
    loginInitialState['firstName'] = 'Admin';
    loginInitialState['lastName'] = 'User';

    mockRouter.setCurrentUrl('/terminology/123-123');

    renderWithProviders(
      <InfoExpander
        data={
          {
            createdBy: 'Creator',
            createdDate: '1970-01-01T00:00:00.000+00:00',
            lastModifiedBy: 'Modifier',
            lastModifiedDate: '1970-01-02T00:00:00.000+00:00',
            properties: {},
            references: {
              contributor: [{ properties: { prefLabel: [] }, id: v4() }],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any
        }
      />,
      reducers,
      { preloadedState: { login: loginInitialState } }
    );

    await waitFor(() => {
      expect(screen.getByText(/1.1.1970, 0.00/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Creator/)).toBeInTheDocument();

    expect(screen.getByText(/2.1.1970, 0.00/)).toBeInTheDocument();
    expect(screen.getByText(/Modifier/)).toBeInTheDocument();
  });

  it('should render one or multiple organizations', async () => {
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['anonymous'] = false;
    loginInitialState['email'] = 'admin@localhost';
    loginInitialState['firstName'] = 'Admin';
    loginInitialState['lastName'] = 'User';

    mockRouter.setCurrentUrl('/terminology/123-123');

    renderWithProviders(
      <InfoExpander
        data={
          {
            createdBy: 'Creator',
            createdDate: '1970-01-01T00:00:00.000+00:00',
            lastModifiedBy: 'Modifier',
            lastModifiedDate: '1970-01-02T00:00:00.000+00:00',
            properties: {},
            references: {
              contributor: [
                {
                  id: 'testi 1',
                  properties: {
                    prefLabel: [{ lang: 'en', value: 'testi 1' }],
                  },
                },
                {
                  id: 'testi 2',
                  properties: {
                    prefLabel: [{ lang: 'en', value: 'testi 2' }],
                  },
                },
                {
                  id: 'testi 3',
                  properties: {
                    prefLabel: [{ lang: 'en', value: 'testi 3' }],
                  },
                },
              ],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any
        }
      />,
      reducers,
      { preloadedState: { login: loginInitialState } }
    );

    await waitFor(() => {
      expect(screen.getByText('testi 1')).toBeInTheDocument();
    });
    expect(screen.getByText('testi 2')).toBeInTheDocument();
    expect(screen.getByText('testi 3')).toBeInTheDocument();
  });
});
