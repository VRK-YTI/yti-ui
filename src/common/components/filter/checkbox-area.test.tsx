import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import CheckboxArea from './checkbox-area';

describe('checkbox-area', () => {
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
          <CheckboxArea
            filter={filter}
            setFilter={setVocabularyFilter}
            title='Title'
            type='infoDomains'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Title')).toBeInTheDocument;
    expect(screen.getByText(/tr-VALID/)).toBeInTheDocument;
    expect(screen.getByText(/tr-DRAFT/)).toBeInTheDocument;
    expect(screen.getByText(/tr-RETIRED/)).toBeInTheDocument;
    expect(screen.getByText(/tr-SUPERSEDED/)).toBeInTheDocument;
  });

  test('should render component with given data', () => {
    const store = makeStore();

    const data = [
      {id: '1', value: 'Value1'},
      {id: '2', value: 'Value2'},
      {id: '3', value: 'Value3'},
      {id: '4', value: 'Value4'},
    ];

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
          <CheckboxArea
            data={data}
            filter={filter}
            setFilter={setVocabularyFilter}
            title='Title'
            type='infoDomains'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Title')).toBeInTheDocument;
    expect(screen.getByText(/Value1/)).toBeInTheDocument;
    expect(screen.getByText(/Value2/)).toBeInTheDocument;
    expect(screen.getByText(/Value3/)).toBeInTheDocument;
    expect(screen.getByText(/Value4/)).toBeInTheDocument;
  });
});
