import { makeStore } from '@app/store';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import CopyTerminologyModal from './copy-terminology-modal';

describe('render', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render component', () => {
    const store = makeStore(getMockContext());
    const mockFn = jest.fn();
    render(
      <Provider store={store}>
        <CopyTerminologyModal
          terminologyId={'testid'}
          visible={true}
          setVisible={mockFn}
        />
      </Provider>,
      { wrapper: themeProvider }
    );
    //Normal components are on screen
    expect(screen.getByText('tr-copy-as-base')).toBeInTheDocument();
    expect(screen.getByText('tr-copy-as-base-description')).toBeInTheDocument();
    //Prefix component is on screen
    expect(screen.getByText('tr-prefix')).toBeInTheDocument();
    expect(screen.getByText('tr-prefix-hint')).toBeInTheDocument();
    expect(screen.getByText('tr-automatic-prefix')).toBeInTheDocument();
    expect(screen.getByText('tr-manual-prefix')).toBeInTheDocument();
    expect(screen.getByText('tr-url-preview')).toBeInTheDocument();
  });
});
