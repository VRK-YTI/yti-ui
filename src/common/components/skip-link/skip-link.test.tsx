import React from 'react';
import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import SkipLink from './skip-link';

describe('skipLink', () => {
  it('should render', () => {
    render(<SkipLink href="#main">Go to main content.</SkipLink>, {
      wrapper: themeProvider,
    });

    expect(screen.getByText('Go to main content.')).toBeInTheDocument();
  });
});
