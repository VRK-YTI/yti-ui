import React from 'react';
import { render, screen } from '@testing-library/react';
import HoverDropdown from '.';
import { themeProvider } from '@app/tests/test-utils';

describe('hoverDropdown', () => {
  it('should render children', async () => {
    render(<HoverDropdown items={[]}>Children</HoverDropdown>, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('should render items', async () => {
    render(
      <HoverDropdown
        items={[{ key: 'Item key', label: 'Item label', value: 'Item value' }]}
      >
        Children
      </HoverDropdown>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('Item label')).toBeInTheDocument();
  });
});
