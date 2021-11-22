import { render, screen } from '@testing-library/react';
import useIsSmall from './useIsSmall';

function TestComponent({ params }: { params: { isSSRMobile: boolean, mediaQuery?: string } }) {
  const isSmall = useIsSmall(params.isSSRMobile, params.mediaQuery);

  return <>{isSmall ? 'Small: true' : 'Small: false'}</>;
}

describe('useIsSmall', () => {
  test('should return true when rendered in server and isSSRMobile = true', async () => {
    // assert global.matchMedia === undefined;

    render(
      <TestComponent params={{ isSSRMobile: true }} />
    );

    expect(screen.getByText('Small: true')).toBeTruthy();
  });

  test('should return false when rendered in server and isSSRMobile = false', async () => {
    // assert global.matchMedia === undefined;

    render(
      <TestComponent params={{ isSSRMobile: false }} />
    );

    expect(screen.getByText('Small: false')).toBeTruthy();
  });

  test('should return true when rendered in mobile', async () => {
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

    render(
      <TestComponent params={{ isSSRMobile: false }} />
    );

    expect(screen.getByText('Small: true')).toBeTruthy();
  });

  test('should return false when rendered in desktop', async () => {
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

    render(
      <TestComponent params={{ isSSRMobile: true }} />
    );

    expect(screen.getByText('Small: false')).toBeTruthy();
  });
});
