import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { Alerts, Alert } from '.';
import { lightTheme } from '../../../layouts/theme';

describe('alert', () => {
  test('should render alert', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts>
          <Alert msg={'alert-msg'} type='error' />
        </Alerts>
      </ThemeProvider>
    );

    expect(screen.getByText('tr-alert-msg')).toBeInTheDocument;
  });

  test('should render multiple alerts', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts>
          <Alert msg={'alert-msg-1'} type='error' />
          <Alert msg={'alert-msg-2'} type='error' />
          <Alert msg={'alert-msg-3'} type='error' />
          <Alert msg={'alert-msg-4'} type='error' />
        </Alerts>
      </ThemeProvider>
    );

    expect(screen.getByText('tr-alert-msg-1')).toBeInTheDocument;
    expect(screen.getByText('tr-alert-msg-2')).toBeInTheDocument;
    expect(screen.getByText('tr-alert-msg-3')).toBeInTheDocument;
    expect(screen.getByText('tr-alert-msg-4')).toBeInTheDocument;
  });

  test('should hide alert when clicking close', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Alerts>
          <Alert msg={'alert-msg'} type='error' />
        </Alerts>
      </ThemeProvider>
    );

    expect(screen.getByText('tr-alert-msg')).toBeInTheDocument;
    userEvent.click(screen.getByText('TR-TOAST-CLOSE'));
    expect(screen.findByText('tr-alert-msg')).toBeNull;
  });
});
