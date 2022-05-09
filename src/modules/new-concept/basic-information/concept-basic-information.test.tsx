import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConceptBasicInformation from './concept-basic-information';

describe('concept-basic-information', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render component', () => {
    render(<ConceptBasicInformation />, { wrapper: themeProvider });

    expect(
      screen.getByText('tr-concept-basic-information')
    ).toBeInTheDocument();
  });

  it('should update definition', () => {
    render(<ConceptBasicInformation />, { wrapper: themeProvider });

    const textArea = screen.getAllByPlaceholderText(/tr-give-definition/);
    expect(textArea).toHaveLength(3);

    userEvent.click(textArea[0]);
    userEvent.keyboard('Finnish definition');

    userEvent.click(textArea[1]);
    userEvent.keyboard('Swedish definition');

    userEvent.click(textArea[2]);
    userEvent.keyboard('English definition');

    expect(screen.getByText('Finnish definition')).toBeInTheDocument();
    expect(screen.getByText('Swedish definition')).toBeInTheDocument();
    expect(screen.getByText('English definition')).toBeInTheDocument();
  });

  it('should update subject', () => {
    render(<ConceptBasicInformation />, { wrapper: themeProvider });

    userEvent.click(
      screen.getByPlaceholderText('tr-subject-visual-placeholder')
    );
    userEvent.keyboard('New subject');

    expect(screen.getByDisplayValue('New subject')).toBeInTheDocument();
  });
});
