import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Breadcrumb, BreadcrumbLink } from '.';
import { lightTheme } from '../layout/theme';

describe('breadcrumb', () => {
  it('should render component', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Breadcrumb>
          <BreadcrumbLink url={'/terminology/123123'} current>
            terminology
          </BreadcrumbLink>
        </Breadcrumb>
      </ThemeProvider>
    );

    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument();
    expect(screen.getByText('terminology')).toBeInTheDocument();
  });

  it('should render entire path', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Breadcrumb>
          <BreadcrumbLink url="/terminology/test123">test</BreadcrumbLink>
          <BreadcrumbLink url="" current>
            concept-title
          </BreadcrumbLink>
        </Breadcrumb>
      </ThemeProvider>
    );

    expect(screen.getByText('concept-title')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument();
  });

  it('should have one crumb to have status of "current"', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <Breadcrumb>
          <BreadcrumbLink url="/terminology/test123">test</BreadcrumbLink>
          <BreadcrumbLink url="" current>
            concept-title
          </BreadcrumbLink>
        </Breadcrumb>
      </ThemeProvider>
    );

    expect(screen.getByText('concept-title')).toBeInTheDocument();
    expect(screen.getByText('concept-title')).toHaveAttribute(
      'class',
      expect.stringMatching(/current/)
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test').getAttribute('class')).not.toMatch(
      /current/
    );

    expect(screen.getByText('tr-terminology-title')).toBeInTheDocument();
    expect(
      screen.getByText('tr-terminology-title').getAttribute('class')
    ).not.toMatch(/current/);
  });
});
