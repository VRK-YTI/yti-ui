import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusSelector from './status-selector';
describe('status-selector', () => {
  it('should change terminology type', () => {
    const mockUpdate = jest.fn();

    render(
      <StatusSelector
        defaultValue="DRAFT"
        userPosted={false}
        update={mockUpdate}
      />,
      {
        wrapper: themeProvider,
      }
    );

    userEvent.click(screen.getByDisplayValue('tr-statuses.draft'));
    userEvent.click(screen.getByText('tr-statuses.incomplete'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'status',
      data: 'INCOMPLETE',
    });
  });
});
