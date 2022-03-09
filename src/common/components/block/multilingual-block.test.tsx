import { render, screen } from '@testing-library/react';
import { MultilingualBlock } from '.';
import { themeProvider } from '../../../tests/test-utils';

describe('MultilingualBlock', () => {
  test('should render items', async () => {
    render(
      <MultilingualBlock<string>
        title="Title"
        data={['Item 1', 'Item 2']}
        mapper={(item) => ({ language: '', content: item })}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument;

    const test1 = await screen.findByText(/Item 1/);
    const test2 = await screen.findByText(/Item 2/);

    expect(test1).toBeInTheDocument;
    expect(test2).toBeInTheDocument;
  });
});
