import { render, screen } from '@testing-library/react';
import SaveSpinner from '.';

describe('save spinner', () => {
  it('should render components', () => {
    render(<SaveSpinner text="test" />);

    //text
    expect(screen.getByText('test')).toBeInTheDocument();
    //div
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
