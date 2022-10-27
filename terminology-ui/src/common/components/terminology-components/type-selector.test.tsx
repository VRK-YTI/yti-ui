import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TypeSelector from './type-selector';

describe('type-selector', () => {
  it('should change terminology type', () => {
    const mockUpdate = jest.fn();

    render(<TypeSelector update={mockUpdate} />, { wrapper: themeProvider });

    userEvent.click(screen.getByText('tr-other-vocabulary'));

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'type',
      data: 'OTHER_VOCABULARY',
    });

    userEvent.click(screen.getByText('tr-terminological-vocabulary'));

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'type',
      data: 'TERMINOLOGICAL_VOCABULARY',
    });
  });
});
