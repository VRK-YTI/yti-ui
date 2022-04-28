import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConceptBasicInformation from './concept-basic-information';

describe('concept-basic-information', () => {
  it('should render component', () => {
    render(
        <ConceptBasicInformation />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('tr-concept-basic-information')).toBeInTheDocument();

  });

  it('should update definition', () => {
    render(
        <ConceptBasicInformation />,
      { wrapper: themeProvider }
    );

    const textArea = screen.getAllByPlaceholderText(/tr-give-definition/);
    expect(textArea).toHaveLength(3);

    userEvent.click(textArea[0]);
    userEvent.keyboard('Finnish definition');

    userEvent.click(textArea[1]);
    userEvent.keyboard('Swedish definition');

    userEvent.click(textArea[2]);
    userEvent.keyboard('English definition');

    // expect(screen.getAllByText(/tr-definition-label-text/)[0].parentNode?.childNodes[1]).toContain('Finnish definition');

  });
});
