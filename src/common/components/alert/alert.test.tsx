import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Alerts } from '.';
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
            status: 500,
            data: { error: '500 error' },
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

    expect(screen.getByText('tr-error-occured')).toBeInTheDocument();
  });

  it('should render multiple alerts', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
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

    expect(screen.queryAllByText(/tr-error-occured/)).toHaveLength(4);
  });

  it('should render non-error alert', () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            status: 0,
            data: { error: 'notification' },
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
    expect(screen.queryByText('TR-TOAST-CLOSE')).not.toBeInTheDocument();
    expect(screen.getByText('tr-notification')).toBeInTheDocument();
  });

  it('should hide alert when clicking close', async () => {
    const store = makeStore(getMockContext());

    store.dispatch(
      setAlert(
        [
          {
            status: 500,
            data: { error: '500 error' },
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

    expect(screen.getByText('tr-error-occured')).toBeInTheDocument();
    userEvent.click(screen.getByText('TR-TOAST-CLOSE'));
    expect(screen.queryByText('tr-error-occured')).not.toBeInTheDocument();
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: '500 error',
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
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
          },
          {
            status: 500,
            data: { error: '500 error' },
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

    expect(screen.getAllByText(/tr-error-occured/)).toHaveLength(4);
    userEvent.click(screen.getAllByText('TR-TOAST-CLOSE')[3]);
    userEvent.click(screen.getAllByText('TR-TOAST-CLOSE')[2]);
    expect(store.getState().alert.alerts).toStrictEqual([
      {
        code: 500,
        message: '500 error',
        visible: true,
      },
      {
        code: 500,
        message: '500 error',
        visible: true,
      },
      {
        code: 500,
        message: '500 error',
        visible: false,
      },
      {
        code: 500,
        message: '500 error',
        visible: false,
      },
    ]);
  });
});
