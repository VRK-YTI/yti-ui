import { makeStore } from '@app/store';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ConceptImportModal from './concept-import-modal';

describe('info-file', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render components', () => {
    const store = makeStore(getMockContext());

    const mockRefetch = jest.fn();
    const mockSetVisible = jest.fn();

    render(
      <Provider store={store}>
        <ConceptImportModal
          visible
          setVisible={mockSetVisible}
          terminologyId="testID"
          refetch={mockRefetch}
        />
      </Provider>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('tr-import-concepts')).toBeInTheDocument();

    expect(
      screen.getByText('tr-import-concepts-to-terminology')
    ).toBeInTheDocument();

    expect(screen.getByText(/tr-allowed-file-formats/)).toBeInTheDocument();
  });
});
