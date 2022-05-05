import React from 'react';
import { render, screen } from '@testing-library/react';
import MainTitle from './main-title';

describe('main title', () => {
  it('should render children', () => {
    render(
      <MainTitle>qwerty</MainTitle>
    );

    expect(screen.getByText('qwerty')).toBeInTheDocument();
  });

  it('should take focus automatically', () => {
    render(
      <MainTitle>qwerty</MainTitle>
    );

    expect(screen.getByRole('heading')).toHaveFocus();
  });
});
