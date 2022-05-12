import { render, screen } from '@testing-library/react';
import NewDiagramOrLink from './new-diagram-or-link';
import { themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';

describe('new-diagram-or-link', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render component', () => {
    render(<NewDiagramOrLink />, { wrapper: themeProvider });

    expect(screen.getByText('tr-add-new-link')).toBeInTheDocument();
  });

  it('should open and close modal', () => {
    render(<NewDiagramOrLink />, { wrapper: themeProvider });

    expect(screen.getByText('tr-add-new-link')).toBeInTheDocument();
    // Open modal
    userEvent.click(screen.getByText('tr-add-new-link'));
    expect(screen.getByText('tr-add-new-diagram-or-link')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('tr-sources-placeholder')
    ).toBeInTheDocument();
    // Close modal
    userEvent.click(screen.getByText('tr-cancel-variant'));
    expect(
      screen.queryByText('tr-add-new-diagram-or-link')
    ).not.toBeInTheDocument();
  });
});
