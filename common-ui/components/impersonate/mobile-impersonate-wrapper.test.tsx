import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileImpersonateWrapper from './mobile-impersonate-wrapper';
import { themeProvider } from '../../utils/test-utils';

const fakeablesUsers = [
  {
    id: '1',
    displayName: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@localhost',
    impersonate: () => '',
  },
];

describe('impersonateHamburgerMenuWrapper', () => {
  it('should show "Impersonate user" text', async () => {
    render(<MobileImpersonateWrapper fakeableUsers={fakeablesUsers} />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('tr-impersonate-user')).toBeInTheDocument();
  });

  it('should show "Admin User" text', async () => {
    render(<MobileImpersonateWrapper fakeableUsers={fakeablesUsers} />, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should render null if users were not found', async () => {
    const { container } = render(
      <MobileImpersonateWrapper fakeableUsers={[]} />,
      {
        wrapper: themeProvider,
      }
    );

    expect(container).toBeEmptyDOMElement();
  });
});
