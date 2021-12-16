import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { resetVocabularyFilter } from '../vocabulary/vocabulary-slice';
import Remove from './remove';

describe('remove', () => {
  test('should render component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Remove
            resetFilter={resetVocabularyFilter}
            title='Title'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Title')).toBeInTheDocument;

  });
});
