import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Breadcrumb, BreadcrumbLink } from '.';
import { useRouter } from '../../../../__mocks__/next-routerMock';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';

describe('breadcrumb', () => {
  test('should render component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url="" current>tr-terminology-title</BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
  });

  test('should render entire path', () => {
    const store = makeStore();

    useRouter().push('/');

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url="/search?page=1">terminology</BreadcrumbLink>
            <BreadcrumbLink url="/test">test</BreadcrumbLink>
            <BreadcrumbLink url="" current>tr-terminology-title</BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('terminology')).toBeInTheDocument;
    expect(screen.getByText('test')).toBeInTheDocument;
    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
  });

  test('should have one crumb to have status of "current"', () => {
    const store = makeStore();

    useRouter().push('/');

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url="/search?page=1">terminology</BreadcrumbLink>
            <BreadcrumbLink url="/test">test</BreadcrumbLink>
            <BreadcrumbLink url="" current>tr-terminology-title</BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('terminology')).toBeInTheDocument;
    expect(screen.getByText('terminology').getAttribute('class')).not.toMatch(/current/);

    expect(screen.getByText('test')).toBeInTheDocument;
    expect(screen.getByText('test').getAttribute('class')).not.toMatch(/current/);

    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument;
    expect(screen.getByText('tr-terminology-title').getAttribute('class')).toMatch(/current/);
  });
});
