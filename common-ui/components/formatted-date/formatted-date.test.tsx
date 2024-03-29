import React from 'react';
import { render, screen } from '@testing-library/react';
import FormattedDate from '.';

describe('formattedDate', () => {
  it('should render date', async () => {
    render(<FormattedDate date="2022-01-02T03:04:00.000Z" />);

    expect(screen.getByText('2.1.2022, 3.04')).toBeInTheDocument();
  });
});
