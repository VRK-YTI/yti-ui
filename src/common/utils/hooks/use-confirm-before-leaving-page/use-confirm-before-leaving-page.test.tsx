import { renderHook } from '@testing-library/react-hooks';
import originalUseConfirmBeforeLeavingPage from './use-confirm-before-leaving-page';
import Router from 'next/router';

describe('useConfirmBeforeLeavingPage', () => {
  let useConfirmBeforeLeavingPage: typeof originalUseConfirmBeforeLeavingPage;

  beforeEach(async () => {
    useConfirmBeforeLeavingPage = (
      await import('./use-confirm-before-leaving-page')
    ).default;

    jest.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
    jest
      .spyOn(window, 'removeEventListener')
      .mockImplementation(() => undefined);
    jest.spyOn(Router.events, 'on').mockImplementation(() => undefined);
    jest.spyOn(Router.events, 'off').mockImplementation(() => undefined);
    jest.clearAllMocks();
  });

  it('should register event listeners when initialized in enabled state', async () => {
    renderHook(() => useConfirmBeforeLeavingPage('enabled'));

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should not register event listeners when initialized in disabled state', async () => {
    renderHook(() => useConfirmBeforeLeavingPage('disabled'));

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.on).not.toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should disable confirmation when disableConfirmation is called', async () => {
    const { result } = renderHook(() => useConfirmBeforeLeavingPage('enabled'));

    expect(window.removeEventListener).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.off).not.toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );

    result.current.disableConfirmation();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.off).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should enable confirmation when enableConfirmation is called', async () => {
    const { result } = renderHook(() =>
      useConfirmBeforeLeavingPage('disabled')
    );

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.on).not.toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );

    result.current.enableConfirmation();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );
    expect(Router.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });
});
