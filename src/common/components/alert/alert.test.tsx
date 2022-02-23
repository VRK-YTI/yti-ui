import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Alerts } from '.';
import { lightTheme } from '../../../layouts/theme';
import { makeStore } from '../../../store';
import { setAlert } from './alert.slice';

describe('alert', () => {
  test('should render alert', () => {
    const store = makeStore();

    store.dispatch(setAlert([
      {
        status: 500,
        data: '500 error'
      }
    ]));

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-error-occured')).toBeInTheDocument;
  });

  test('should render multiple alerts', () => {
    const store = makeStore();

    store.dispatch(setAlert([
      {
        status: 500,
        data: '500 error'
      },
      {
        status: 500,
        data: '500 error'
      },
      {
        status: 500,
        data: '500 error'
      },
      {
        status: 500,
        data: '500 error'
      }
    ]));

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryAllByText(/tr-error-occured/)).toHaveLength(4);
  });

  test('should hide alert when clicking close', () => {
    const store = makeStore();

    store.dispatch(setAlert([
      {
        status: 500,
        data: '500 error'
      }
    ]));

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-error-occured')).toBeInTheDocument;
    userEvent.click(screen.getByText('TR-TOAST-CLOSE'));
    expect(screen.findByText('tr-error-occured')).toBeNull;
  });
});
