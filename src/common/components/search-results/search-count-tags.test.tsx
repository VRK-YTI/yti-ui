import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import SearchCountTags from './search-count-tags';

describe('search-count-tags', () => {
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
          <SearchCountTags
            count={4}
            filter={filter}
            setFilter={setVocabularyFilter}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/4/)).toBeInTheDocument;
    expect(screen.getByText(/tr-VALID/)).toBeInTheDocument;
    expect(screen.getByText(/tr-DRAFT/)).toBeInTheDocument;
  });
});
