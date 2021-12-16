import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import SearchInputArea from './search-input-area';

describe('search-input-area', () => {
  test('should render component', () => {
    const store = makeStore();

    const filter = {
      infoDomains: [],
      keyword: '',
      showByOrg: '',
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      }
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <SearchInputArea
            filter={filter}
            setFilter={setVocabularyFilter}
            title={'Title'}
            visualPlaceholder={'Placeholder'}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument;
    expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument;

  });
});
