import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectData } from 'suomifi-ui-components';
import LanguageBlock from './language-block';

describe('language-block', () => {
  it('should change title and description', () => {
    const mockUpdate = jest.fn();

    const lang = { uniqueItemId: 'fi' } as unknown as MultiSelectData;

    render(
      <LanguageBlock
        lang={lang}
        isSmall={false}
        handleUpdate={mockUpdate}
        userPosted={false}
        id="fi"
      />,
      { wrapper: themeProvider }
    );

    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-name-placeholder')
    );
    userEvent.keyboard('title');
    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-description-placeholder')
    );

    expect(mockUpdate).toHaveBeenCalledWith('fi', 'title', '');

    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-description-placeholder')
    );
    userEvent.keyboard('description');
    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-name-placeholder')
    );

    expect(mockUpdate).toHaveBeenCalledWith('fi', 'title', 'description');
  });
});
