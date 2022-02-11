import React from 'react';
import { render, screen } from '@testing-library/react';
import TextLinks from './index';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../layouts/theme';

describe('text-links', () => {
  test('should render component without links', () => {

    render(
      <ThemeProvider theme={lightTheme}>
        <TextLinks text={'This is a test'} />
      </ThemeProvider>
    );

    expect(screen.queryByText('This is a test')).toBeTruthy();
    expect(screen.queryByText('This is a test')).not.toHaveAttribute('href');
  });

  test('should render component with internal link', () => {

    render(
      <ThemeProvider theme={lightTheme}>
        <TextLinks text={
          'This is a <a href=\'uri.suomi.fi/terminology/demo/concept-001\' data-type=\'internal\'>test</a> with a link'
        } />
      </ThemeProvider>
    );

    expect(screen.queryByText('This is a')).toBeTruthy();
    expect(screen.queryByText('test')).toBeTruthy();
    expect(screen.queryByText('test')).toHaveAttribute('href');
    expect(screen.queryByText('test')).not.toHaveClass('fi-link--external');
    expect(screen.queryByText('with a link')).toBeTruthy();
  });

  test('should render component with external link', () => {

    render(
      <ThemeProvider theme={lightTheme}>
        <TextLinks text={
          'This is a <a href=\'google.com\' data-type=\'external\'>test</a> with a link'
        } />
      </ThemeProvider>
    );

    expect(screen.queryByText('This is a')).toBeTruthy();
    expect(screen.queryByText('test')).toBeTruthy();
    expect(screen.queryByText('test')).toHaveAttribute('href');
    expect(screen.queryByText('test')).toHaveClass('fi-link--external');
    expect(screen.queryByText('with a link')).toBeTruthy();
  });

  test('should render component with multiple internal and external links', () => {

    render(
      <ThemeProvider theme={lightTheme}>
        <TextLinks text={
          `This is an <a href=\'google.com\' data-type=\'external\'>external</a> link.
           <br />
           This is an <a href=\'uri.suomi.fi/terminology/demo/concept-001\' data-type=\'internal\'>internal</a> link.
           This is another <a href=\'google.com\' data-type=\'external\'>link</a>.
          `
        } />
      </ThemeProvider>
    );

    expect(screen.queryAllByText(/This is an/)).toBeTruthy();
    expect(screen.queryByText(/This is another/)).toBeTruthy();

    expect(screen.queryByText('external')).toBeTruthy();
    expect(screen.queryByText('external')).toHaveAttribute('href');
    expect(screen.queryByText('external')).toHaveClass('fi-link--external');

    expect(screen.queryByText('internal')).toBeTruthy();
    expect(screen.queryByText('internal')).toHaveAttribute('href');
    expect(screen.queryByText('internal')).not.toHaveClass('fi-link--external');

    expect(screen.queryByText('link')).toBeTruthy();
    expect(screen.queryByText('link')).toHaveAttribute('href');
    expect(screen.queryByText('link')).toHaveClass('fi-link--external');
  });

});
