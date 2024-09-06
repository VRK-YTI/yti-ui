/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import InfoExpander from '@app/common/components/info-dropdown/info-expander';
import { renderWithProviders } from '@app/tests/test-utils';
import {
  initialState,
  loginApi,
} from '@app/common/components/login/login.slice';
import mockRouter from 'next-router-mock';
import { adminControlsSlice } from '../admin-controls/admin-controls.slice';
import { terminologyApi } from '../vocabulary/vocabulary.slice';
import { subscriptionApi } from '../subscription/subscription.slice';
import { screen, waitFor } from '@testing-library/react';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import { TerminologyInfo } from '@app/common/interfaces/interfaces-v2';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const reducers = [
  adminControlsSlice,
  terminologyApi,
  loginApi,
  subscriptionApi,
  terminologySearchApi,
];

const data = {
  uri: '',
  prefix: '',
  graphType: 'TERMINOLOGICAL_VOCABULARY',
  status: 'DRAFT',
  languages: ['fi'],
  contact: '',
  label: { fi: 'label' },
  description: {},
  organizations: [
    {
      id: '123',
      label: { fi: 'testi 1' },
    },
    {
      id: '456',
      label: { fi: 'testi 2' },
    },
    {
      id: '789',
      label: { fi: 'testi 3' },
    },
  ],
  groups: [
    {
      id: '123',
      label: { fi: 'group' },
      identifier: 'P10',
    },
  ],
  creator: {
    id: '123',
    name: 'Creator',
  },
  created: '1970-01-01T00:00:00.000+00:00',
  modifier: {
    id: '123',
    name: 'Modifier',
  },
  modified: '1970-01-02T00:00:00.000+00:00',
} as TerminologyInfo;

describe('infoExpander', () => {
  it('should render subscribe button', async () => {
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['anonymous'] = false;
    loginInitialState['email'] = 'admin@localhost';
    loginInitialState['firstName'] = 'Admin';
    loginInitialState['lastName'] = 'User';

    mockRouter.setCurrentUrl('/terminology/123-123');

    renderWithProviders(<InfoExpander data={data} />, reducers, {
      preloadedState: { login: loginInitialState },
    });

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

    renderWithProviders(<InfoExpander data={data} />, reducers, {
      preloadedState: { login: loginInitialState },
    });

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

    renderWithProviders(<InfoExpander data={data} />, reducers, {
      preloadedState: { login: loginInitialState },
    });

    await waitFor(() => {
      expect(screen.getByText('testi 1')).toBeInTheDocument();
    });
    expect(screen.getByText('testi 2')).toBeInTheDocument();
    expect(screen.getByText('testi 3')).toBeInTheDocument();
  });
});
