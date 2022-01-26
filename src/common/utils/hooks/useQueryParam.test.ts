import { renderHook } from '@testing-library/react-hooks';
import useQueryParam from './useQueryParam';
import { NextRouter, useRouter } from 'next/router';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('useQueryParam', () => {
  it('should return value and update function', async () => {
    mockedUseRouter.mockReturnValue({ query: {} } as NextRouter);

    const { result } = renderHook(() => useQueryParam('q'));
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toBeUndefined();
    expect(typeof result.current[1]).toBe('function');
  });

  it('should return value of matching query parameter', async () => {
    mockedUseRouter.mockReturnValue({ query: { q: 'Lorem ipsum'} } as any);

    const { result } = renderHook(() => useQueryParam('q'));
    expect(result.current[0]).toBe('Lorem ipsum');
  });

  it('should update only the matching query parameter when called update function', async () => {
    const push = jest.fn();
    mockedUseRouter.mockReturnValue({
      query: { q: 'Lorem ipsum', a: 'a' },
      push,
    } as any);

    const { result } = renderHook(() => useQueryParam('q'));
    await result.current[1]('new value');
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({ query: { q: 'new value', a: 'a' } }),
      undefined,
      expect.anything(),
    );
  });
});
