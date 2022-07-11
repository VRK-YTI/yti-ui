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
            error: {
              status: 500,
              data: { error: '500 error' },
            },
            displayText: '_test-1',
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

    expect(screen.getByText('tr-error-occured_test-1')).toBeInTheDocument();
  });

  it('should render multiple alerts', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-1',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-2',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-3',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-4',
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

    expect(screen.getByText('(4) tr-error-occured_test-1')).toBeInTheDocument();
  });

  it('should render non-error alert', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            error: {
              status: 0,
              data: 'notification',
            },
            displayText: 'logged-out',
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

    expect(screen.queryByText('tr-error-occured')).not.toBeInTheDocument();
    expect(screen.getByText('tr-logged-out')).toBeInTheDocument();
  });

  it('should hide alert when clicking close', async () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-1',
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

    expect(screen.getByText('tr-error-occured_test-1')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    expect(
      screen.queryByText('tr-error-occured_test-1')
    ).not.toBeInTheDocument();
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: 'Error code 500',
        displayText: '_test-1',
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
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-1',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-2',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-3',
          },
          {
            error: {
              status: 500,
              data: '500 error',
            },
            displayText: '_test-4',
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

    expect(screen.getByText('(4) tr-error-occured_test-1')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('button'));
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: 'Error code 500',
        displayText: '_test-1',
        visible: false,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: '_test-2',
        visible: false,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: '_test-3',
        visible: true,
      },
      {
        code: 500,
        message: 'Error code 500',
        displayText: '_test-4',
        visible: true,
      },
    ]);
  });
});
