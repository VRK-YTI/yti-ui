import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setVocabularyFilter } from '../vocabulary/vocabulary-slice';
import RadioButtonArea from './radio-button-area';

describe('radio-button-area', () => {
  test('should render component', () => {
    const store = makeStore();

    const filter = {
      keyword: '',
      showBy: 'concepts',
      status: {
        'VALID': true,
        'DRAFT': true,
        'RETIRED': false,
        'SUPERSEDED': false
      },
      tKeyword: ''
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <RadioButtonArea
            filter={filter}
            data={['concepts', 'collections']}
            setFilter={setVocabularyFilter}
            title='Title'
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/tr-vocabulary-filter-concepts/)).toBeInTheDocument;
    expect(screen.getByText(/tr-vocabulary-filter-collections/)).toBeInTheDocument;

  });
});
