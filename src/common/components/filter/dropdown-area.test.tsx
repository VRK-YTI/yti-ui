import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import DropdownArea from './dropdown-area';

describe('dropdown-area', () => {
  test('renders component', () => {
    const store = makeStore();

    const filter = {
      infoDomains: {},
      keyword: '',
      showByOrg: '',
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      },
      tKeyword: ''
    };

    const data = [
      'Organization1',
      'Organization2',
      'Organization3',
      'Organization4',
    ];

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <DropdownArea
            data={data}
            filter={filter}
            setFilter={setVocabularyFilter}
            title='Title'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Organization1')).toBeInTheDocument;
    expect(screen.getByText('Organization2')).toBeInTheDocument;
    expect(screen.getByText('Organization3')).toBeInTheDocument;
    expect(screen.getByText('Organization4')).toBeInTheDocument;
  });
});
