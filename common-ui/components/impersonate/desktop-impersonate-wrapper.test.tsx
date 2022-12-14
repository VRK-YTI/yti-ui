import React from 'react';
import { render, screen } from '@testing-library/react';
import ImpersonateWrapper from './desktop-impersonate-wrapper';
import { themeProvider } from '../../utils/test-utils';

describe('impersonateWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    render(
      <ImpersonateWrapper
        fakeableUsers={[
          {
            id: '1',
            email: 'admin@localhost',
            firstName: 'Admin',
            lastName: 'User',
          },
        ]}
      >
        Children
      </ImpersonateWrapper>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('tr-impersonate-user')).toBeInTheDocument();
  });

  it('should show "Admin User" text', async () => {
    render(
      <ImpersonateWrapper
        fakeableUsers={[
          {
            id: '1',
            email: 'admin@localhost',
            firstName: 'Admin',
            lastName: 'User',
          },
        ]}
      >
        Children
      </ImpersonateWrapper>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should render children', async () => {
    render(
      <ImpersonateWrapper
        fakeableUsers={[
          {
            id: '1',
            email: 'admin@localhost',
            firstName: 'Admin',
            lastName: 'User',
          },
        ]}
      >
        Children
      </ImpersonateWrapper>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('should render only children when users were not found', async () => {
    render(
      <ImpersonateWrapper fakeableUsers={[]}>Children</ImpersonateWrapper>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.queryByText('tr-impersonate-user')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
  });
});
