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
      data: 'admin@email.org',
    });
  });

  it('should show initial data', () => {
    const mockUpdate = jest.fn();

    render(
      <ContactInfo
        defaultValue="test contact info"
        update={mockUpdate}
        userPosted={false}
      />,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByDisplayValue('test contact info')).toBeInTheDocument();
  });
});
