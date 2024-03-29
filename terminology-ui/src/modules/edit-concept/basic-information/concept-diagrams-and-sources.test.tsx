import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import ConceptDiagramsAndSources from './concept-diagrams-and-sources';
import { EmptyFormError } from '../validate-form';

describe('concept-diagrams-and-sources', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render component', () => {
    const mockFn = jest.fn();

    render(
      <ConceptDiagramsAndSources
        infoKey="diagramsAndSources"
        update={mockFn}
        errors={EmptyFormError}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText('tr-concept-diagrams-and-sources')
    ).toBeInTheDocument();
    expect(screen.getByText('tr-concept-diagram-or-link')).toBeInTheDocument();
    expect(
      screen.getByText('tr-sources-hint-text-concept')
    ).toBeInTheDocument();
  });
});
