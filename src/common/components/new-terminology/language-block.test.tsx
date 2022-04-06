import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectData } from 'suomifi-ui-components';
import LanguageBlock from './language-block';

describe('language-block', () => {
  it('should change title and description', () => {
    const mockUpdate = jest.fn();

    const lang = { uniqueItemId: 'fi' } as unknown as MultiSelectData;
    const terminologyNames = [
      {
        lang: 'fi',
        name: '',
        description: '',
      },
    ];

    render(
      <LanguageBlock
        lang={lang}
        isSmall={false}
        terminologyNames={terminologyNames}
        setTerminologyNames={mockUpdate}
        userPosted={false}
      />,
      { wrapper: themeProvider }
    );

    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-name-placeholder')
    );
    userEvent.keyboard('title');
    userEvent.click(screen.getByText('tr-terminology-name'));

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith([
      {
        lang: 'fi',
        name: 'title',
        description: '',
      },
    ]);

    userEvent.click(
      screen.getByPlaceholderText('tr-terminology-description-placeholder')
    );
    userEvent.keyboard('description');
    userEvent.click(screen.getByText('tr-terminology-name'));

    expect(mockUpdate).toHaveBeenCalledTimes(4);
    expect(mockUpdate).toHaveBeenCalledWith([
      {
        lang: 'fi',
        name: 'title',
        description: 'description',
      },
    ]);
  });
});
