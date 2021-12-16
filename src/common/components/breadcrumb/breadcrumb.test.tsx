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
          <BreadcrumbNav />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-front-page')).toBeInTheDocument;
    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
  });

  test('should only render "front-page" when path is empty', () => {
    const store = makeStore();

    useRouter().push('/');

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <BreadcrumbNav />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-front-page')).toBeInTheDocument;
    expect(screen.queryByText('tr-terminology-title')).toEqual(null);
  });
});
