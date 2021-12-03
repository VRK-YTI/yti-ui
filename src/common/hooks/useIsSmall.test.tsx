import { renderHook } from '@testing-library/react-hooks';
import useIsSmall from './useIsSmall';

describe('useIsSmall', () => {
  it('should return true when rendered in server and isSSRMobile = true', async () => {
    // assert global.matchMedia === undefined;

    const { result } = renderHook(() => useIsSmall(true));

    expect(result.current).toEqual(true);
  });

  it('should return false when rendered in server and isSSRMobile = false', async () => {
    // assert global.matchMedia === undefined;

    const { result } = renderHook(() => useIsSmall(false));

    expect(result.current).toEqual(false);
  });

  it('should return true when rendered in mobile', async () => {
    global.matchMedia = () => ({
      matches: true,
      addListener: () => {},
      removeListener: () => {},
      media: '',
      addEventListener: () => {},
      removeEventListener: () => {},
      onchange: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useIsSmall(false));

    expect(result.current).toEqual(true);
  });

  it('should return false when rendered in desktop', async () => {
    global.matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      media: '',
      addEventListener: () => {},
      removeEventListener: () => {},
      onchange: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useIsSmall(true));

    expect(result.current).toEqual(false);
  });
});
