import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from './language-selector';

describe('language-selector', () => {
  it('should add and remove language blocks', () => {
    const mockUpdate = jest.fn();

    render(<LanguageSelector update={mockUpdate} userPosted={false} />, {
      wrapper: themeProvider,
    });

    userEvent.click(
      screen.getByPlaceholderText('tr-languages-visual-placeholder')
    );
    userEvent.click(screen.getByText('tr-language-label-text-fi'));

    expect(screen.getByText(/tr-terminology-name/)).toBeInTheDocument();
    expect(mockUpdate).toHaveBeenCalledTimes(3);
    expect(mockUpdate).toHaveBeenCalledWith({
      key: 'description',
      data: [
        [
          {
            description: '',
            lang: 'fi',
            name: '',
          },
        ],
        false,
      ],
    });

    userEvent.click(screen.getByRole('button'));
    expect(screen.queryAllByText(/tr-terminology-name/)).toStrictEqual([]);
  });
});
