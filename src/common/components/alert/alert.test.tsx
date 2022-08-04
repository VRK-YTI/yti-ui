import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import Alerts from './';
import { lightTheme } from '@app/layouts/theme';
import { makeStore } from '@app/store';
import { setAlert } from './alert.slice';
import { getMockContext } from '@app/tests/test-utils';

describe('alert', () => {
  it('should render alert', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            note: {
              status: 500,
              data: { error: '500 error' },
            },
            displayText: 'Error 1',
          },
        ],
        []
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-error-alert')).toBeInTheDocument();
  });

  it('should render multiple alerts', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 1',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 2',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 3',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 4',
          },
        ],
        []
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('(4) tr-error-alert')).toBeInTheDocument();
  });

  it('should render non-error alert', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            note: {
              status: 0,
              data: 'notification',
            },
            displayText: 'Logged out',
          },
        ],
        []
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByText('tr-error-alert')).not.toBeInTheDocument();
    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });

  it('should hide alert when clicking close', async () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 1',
          },
        ],
        []
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('tr-error-alert')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('tr-error-alert')).not.toBeInTheDocument();
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: 'Error code 500',
        displayText: 'Error 1',
        visible: false,
      },
    ]);
  });

  it('should hide multiple alert when closed', async () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 1',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 2',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 3',
          },
          {
            note: {
              status: 500,
              data: '500 error',
            },
            displayText: 'Error 4',
          },
        ],
        []
      )
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Alerts />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('(4) tr-error-alert')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('button'));
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: 'Error code 500',
        displayText: 'Error 1',
        visible: false,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: 'Error 2',
        visible: false,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: 'Error 3',
        visible: true,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: 'Error 4',
        visible: true,
      },
    ]);
  });
});
