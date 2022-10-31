import { render, screen } from '@testing-library/react';
import { PropertyBlock } from '.';

describe('propertyBlock', () => {
  it('should render property', () => {
    render(
      <PropertyBlock
        title="Title"
        property={[{ lang: '', value: 'Property value', regex: '' }]}
      />
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument();
    expect(screen.getByText(/Property value/)).toBeInTheDocument();
  });
});
