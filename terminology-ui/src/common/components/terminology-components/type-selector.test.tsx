import { renderWithProviders } from '@app/tests/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import TypeSelector from './type-selector';

describe('type-selector', () => {
  it('should change terminology type', () => {
    const mockUpdate = jest.fn();

    renderWithProviders(<TypeSelector update={mockUpdate} />);

    fireEvent.click(screen.getByText('tr-other-vocabulary'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'type',
      data: 'OTHER_VOCABULARY',
    });

    fireEvent.click(screen.getByText('tr-terminological-vocabulary'));

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'type',
      data: 'TERMINOLOGICAL_VOCABULARY',
    });
  });
});
