import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import Alerts from './';
import { lightTheme } from '../layout/theme';

describe('alert', () => {
  it('should render alert', () => {
    const alerts = [
      {
        code: '404',
        message: '404 error',
        displayText: 'Error 1',
        visible: true,
      },
    ];

    const setAlertVisibility = jest.fn();

    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts alerts={alerts} setAlertVisibility={setAlertVisibility} />
      </ThemeProvider>
    );

    expect(screen.getByText('tr-error-alert')).toBeInTheDocument();
  });

  it('should render multiple alerts', () => {
    const alerts = [
      {
        code: '404',
        message: 'Error code 404',
        displayText: 'Error 1',
        visible: true,
      },
      {
        code: '400',
        message: 'Error code 400',
        displayText: 'Error 2',
        visible: true,
      },
      {
        code: '500',
        message: 'Error code 500',
        displayText: 'Error 3',
        visible: true,
      },
      {
        code: '404',
        message: 'Error code 404',
        displayText: 'Error 4',
        visible: true,
      },
    ];

    const setAlertVisibility = jest.fn();

    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts alerts={alerts} setAlertVisibility={setAlertVisibility} />
      </ThemeProvider>
    );

    expect(screen.getByText('(4) tr-error-alert')).toBeInTheDocument();
  });

  it('should render non-error alert', () => {
    const alerts = [
      {
        code: 0,
        message: 'notification',
        displayText: 'Logged out',
        visible: true,
      },
    ];

    const setAlertVisibility = jest.fn();

    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts alerts={alerts} setAlertVisibility={setAlertVisibility} />
      </ThemeProvider>
    );

    expect(screen.queryByText('tr-error-alert')).not.toBeInTheDocument();
    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });

  it('should set alert hidden when clicking close', async () => {
    const alerts = [
      {
        code: '500',
        message: 'Error code 500',
        displayText: 'Error 1',
        visible: true,
      },
    ];

    const setAlertVisibility = jest.fn();

    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts alerts={alerts} setAlertVisibility={setAlertVisibility} />
      </ThemeProvider>
    );

    expect(screen.getByText('tr-error-alert')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button'));
    expect(setAlertVisibility).toHaveBeenCalledTimes(1);
    expect(setAlertVisibility).toHaveBeenCalledWith(alerts, 'Error 1');
  });
});
