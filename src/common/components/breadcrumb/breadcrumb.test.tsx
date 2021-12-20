import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { useRouter } from '../../../../__mocks__/next-routerMock';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import BreadcrumbNav from './breadcrumb';

describe('breadcrumb', () => {
  test('should render component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <BreadcrumbNav title={{ value: 'tr-terminology-title', url: 'search' }} />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-front-page')).toBeInTheDocument;
    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
  });

  test('should render entire path', () => {
    const store = makeStore();

    useRouter().push('/');

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <BreadcrumbNav
            title={{ value: 'tr-terminology-title', url: 'search' }}
            breadcrumbs={[
              { value: 'terminology', url: 'search' },
              { value: 'test', url: 'tset' }
            ]}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-front-page')).toBeInTheDocument;
    expect(screen.getByText('terminology')).toBeInTheDocument;
    expect(screen.getByText('test')).toBeInTheDocument;
    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
  });
});
