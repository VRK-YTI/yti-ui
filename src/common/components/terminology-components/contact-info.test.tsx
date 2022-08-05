import '@app/tests/matchMedia.mock';
import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactInfo from './contact-info';

describe('contact-info', () => {
  it('should take input', () => {
    const mockUpdate = jest.fn();

    render(<ContactInfo update={mockUpdate} userPosted={false} />, {
      wrapper: themeProvider,
    });

    userEvent.click(
      screen.getByPlaceholderText('tr-contact-visual-placeholder')
    );
    userEvent.keyboard('admin@email.org');
    userEvent.click(screen.getByText('tr-contact-information'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'contact',
      data: ['admin@email.org', true],
    });
  });

  it('should mark invalid input', () => {
    const mockUpdate = jest.fn();

    render(<ContactInfo update={mockUpdate} userPosted={false} />, {
      wrapper: themeProvider,
    });

    userEvent.click(
      screen.getByPlaceholderText('tr-contact-visual-placeholder')
    );
    userEvent.keyboard('adminemail.org');
    userEvent.click(screen.getByText('tr-contact-information'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'contact',
      data: ['adminemail.org', false],
    });
    expect(screen.getByText('tr-contact-email-invalid')).toBeInTheDocument();
  });
});
