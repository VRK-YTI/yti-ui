import { fireEvent, screen } from '@testing-library/react';
import ContactInfo from './contact-info';
import { renderWithProviders } from '@app/tests/test-utils';

describe('contact-info', () => {
  it('should take input', () => {
    const mockUpdate = jest.fn();

    renderWithProviders(<ContactInfo update={mockUpdate} userPosted={false} />);

    const contactEl = screen.getByPlaceholderText(
      'tr-contact-visual-placeholder'
    );

    fireEvent.click(contactEl);
    fireEvent.change(contactEl, { target: { value: 'admin@email.org' } });
    fireEvent.focusOut(contactEl);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'contact',
      data: 'admin@email.org',
    });
  });

  it('should show initial data', () => {
    const mockUpdate = jest.fn();

    renderWithProviders(
      <ContactInfo
        defaultValue="test contact info"
        update={mockUpdate}
        userPosted={false}
      />
    );

    expect(screen.getByDisplayValue('test contact info')).toBeInTheDocument();
  });
});
