import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import SearchInputArea from './search-input-area';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;


describe('search-input-area', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

    const store = makeStore();

    const filter = {
      infoDomains: [],
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
