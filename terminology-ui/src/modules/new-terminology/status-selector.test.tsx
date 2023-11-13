import { renderWithProviders } from '@app/tests/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import StatusSelector from './status-selector';

describe('status-selector', () => {
  it('should change terminology type', () => {
    const mockUpdate = jest.fn();

    renderWithProviders(
      <StatusSelector
        defaultValue="DRAFT"
        userPosted={false}
        update={mockUpdate}
      />
    );

    fireEvent.click(screen.getByDisplayValue('tr-statuses.draft'));
    fireEvent.click(screen.getByText('tr-statuses.incomplete'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'status',
      data: 'INCOMPLETE',
    });
  });
});
