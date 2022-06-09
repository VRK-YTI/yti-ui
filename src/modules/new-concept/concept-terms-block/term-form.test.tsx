import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermForm from './term-form';

describe('term-form', () => {
  it('should render component', () => {
    render(<TermForm lang="fi" />, { wrapper: themeProvider });

    expect(
      screen.getByText('tr-concept-preferred-terms-title')
    ).toBeInTheDocument();
  });

  it('should render all statuses', () => {
    render(<TermForm lang="fi" />, { wrapper: themeProvider });

    // Expect two tr-DRAFT because the default value in dropdown is draft.
    expect(screen.getAllByText(/tr-DRAFT/)).toHaveLength(2);

    userEvent.click(screen.getAllByText(/tr-DRAFT/)[0]);

    expect(screen.getByText('tr-INCOMPLETE')).toBeInTheDocument();
    expect(screen.getByText('tr-VALID')).toBeInTheDocument();
    expect(screen.getByText('tr-SUPERSEDED')).toBeInTheDocument();
    expect(screen.getByText('tr-RETIRED')).toBeInTheDocument();
    expect(screen.getByText('tr-INVALID')).toBeInTheDocument();
    expect(screen.getByText('tr-SUGGESTED')).toBeInTheDocument();
  });
});
