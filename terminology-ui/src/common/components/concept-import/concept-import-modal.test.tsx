import { renderWithProviders } from '@app/tests/test-utils';
import { screen } from '@testing-library/react';
import ConceptImportModal from './concept-import-modal';

describe('info-file', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render components', () => {
    const mockRefetch = jest.fn();
    const mockSetVisible = jest.fn();

    renderWithProviders(
      <ConceptImportModal
        visible
        setVisible={mockSetVisible}
        terminologyId="testID"
        refetch={mockRefetch}
      />
    );

    expect(screen.getByText('tr-import-concepts')).toBeInTheDocument();

    expect(
      screen.getByText('tr-import-concepts-to-terminology')
    ).toBeInTheDocument();

    expect(screen.getByText(/tr-allowed-file-formats/)).toBeInTheDocument();
  });
});
