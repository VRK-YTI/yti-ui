import React from 'react';
import { render, screen } from '@testing-library/react';
import BadgeBar from './badge-bar';
import { themeProvider } from '../../../tests/test-utils';

describe('badge bar', () => {
  it('should render one item without separators', () => {
    render(<BadgeBar data-testid="badge-bar">A</BadgeBar>, {
      wrapper: themeProvider,
    });

    expect(screen.getByTestId('badge-bar').innerHTML).toBe('A');
  });

  it('should render multiple items with separators', () => {
    render(
      <BadgeBar data-testid="badge-bar">
        {'A'}
        {'B'}
        {'C'}
      </BadgeBar>,
      { wrapper: themeProvider }
    );

    expect(screen.getByTestId('badge-bar').innerHTML).toBe(
      'A \u00b7 B \u00b7 C'
    );
  });
});
