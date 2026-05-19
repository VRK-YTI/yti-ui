import React from 'react';
import { render, screen } from '@testing-library/react';
import SanitizedTextContent from './index';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';

describe('sanitized-text-content', () => {
  it('should render component without links', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <SanitizedTextContent text={'This is a test'} />
      </ThemeProvider>
    );

    expect(screen.getByText('This is a test')).toBeInTheDocument();
    expect(screen.queryByText('This is a test')).not.toHaveAttribute('href');
  });

  it('should render component with different internal link', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <SanitizedTextContent
          text={`This is a <a href='https://uri.suomi.fi/terminology/demo/concept-001' data-type='internal'>internal test</a> with link.
           This is a <a href='https://uri.suomi.fi/terminology/demo/concept-002' data-type='broader'>broader test</a> with link.
           This is a <a href='https://uri.suomi.fi/terminology/demo/concept-003' data-type='related'>related test</a> with link.
          `}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('internal test')).toBeInTheDocument();
    expect(screen.queryByText('internal test')).toHaveAttribute('href');
    expect(screen.queryByText('internal test')).not.toHaveClass(
      'fi-link--external'
    );

    expect(screen.getByText('broader test')).toBeInTheDocument();
    expect(screen.queryByText('broader test')).toHaveAttribute('href');
    expect(screen.queryByText('broader test')).not.toHaveClass(
      'fi-link--external'
    );

    expect(screen.getByText('related test')).toBeInTheDocument();
    expect(screen.queryByText('related test')).toHaveAttribute('href');
    expect(screen.queryByText('related test')).not.toHaveClass(
      'fi-link--external'
    );
  });

  it('should render component with external link', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <SanitizedTextContent text="This is a <a href='https://google.com' data-type='external'>test</a> with a link" />
      </ThemeProvider>
    );

    expect(screen.getByText(/This is a/)).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.queryByText('test')).toHaveAttribute('href');
    expect(screen.queryByText('test')).toHaveClass('fi-link--external');
    expect(screen.getByText(/with a link/)).toBeInTheDocument();
  });

  it('should render component with multiple internal and external links', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <SanitizedTextContent
          text={`This is an <a href='https://google.com' data-type='external'>external</a> link.
           <br />
           This is an <a href='https://uri.suomi.fi/terminology/demo/concept-001' data-type='internal'>internal</a> link.
           This is another <a href='https://google.com' data-type='external'>link</a>.
          `}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/This is an/)).toBeInTheDocument();
    expect(screen.getByText(/This is another/)).toBeInTheDocument();

    expect(screen.getByText('external')).toBeInTheDocument();
    expect(screen.queryByText('external')).toHaveAttribute('href');
    expect(screen.queryByText('external')).toHaveClass('fi-link--external');

    expect(screen.getByText('internal')).toBeInTheDocument();
    expect(screen.queryByText('internal')).toHaveAttribute('href');
    expect(screen.queryByText('internal')).not.toHaveClass('fi-link--external');

    expect(screen.getByText('link')).toBeInTheDocument();
    expect(screen.queryByText('link')).toHaveAttribute('href');
    expect(screen.queryByText('link')).toHaveClass('fi-link--external');
  });

  it('should sanitize uri', () => {
    const { container } = render(
      <ThemeProvider theme={lightTheme}>
        <SanitizedTextContent text="This is a <a href='javascript:alert('Not a valid uri')' data-type='external'>test</a> with javascript" />
      </ThemeProvider>
    );

    expect(screen.getByText(/This is a/)).toBeInTheDocument();
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.queryByText(/test/)).not.toHaveAttribute('href');
    expect(screen.queryByText(/test/)).not.toHaveClass('fi-link--external');
    expect(screen.getByText(/with javascript/)).toBeInTheDocument();
    expect(container).toHaveTextContent(/<a[^>]*>test<\/a>/);
  });

  it('should render invalid links as broken markup', () => {
    const missingHrefLink = '<a>missing href</a>';
    const emptyHrefLink = '<a href="">empty href</a>';
    const whitespaceHrefLink = '<a href="   ">whitespace href</a>';
    const malformedHrefLink = '<a href="not-a-url">malformed href</a>';
    const unsafeHrefLink = '<a href="javascript:alert(1)">unsafe href</a>';

    const { container } = render(
      <SanitizedTextContent
        text={`This is a ${missingHrefLink}, ${emptyHrefLink}, ${whitespaceHrefLink}, ${malformedHrefLink}, and ${unsafeHrefLink} with invalid links`}
      />
    );

    expect(screen.getByText(/missing href/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /missing href/ })
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/<a>missing href<\/a>/);

    expect(screen.getByText(/empty href/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /empty href/ })
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/<a href="">empty href<\/a>/);

    expect(screen.getByText(/whitespace href/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /whitespace href/ })
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/<a href=" ">whitespace href<\/a>/);

    expect(screen.getByText(/malformed href/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /malformed href/ })
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent(
      /<a href="not-a-url">malformed href<\/a>/
    );

    expect(screen.getByText(/unsafe href/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /unsafe href/ })
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent(/<a[^>]*>unsafe href<\/a>/);
  });
});
