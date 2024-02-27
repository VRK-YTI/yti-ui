import { renderHook } from '@testing-library/react';
import useMountEffect from '.';

describe('useMountEffect', () => {
  it('should call callback on first render', () => {
    const fn = jest.fn();
    renderHook(() => useMountEffect(fn));

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call callback only on first render', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => useMountEffect(fn));

    rerender();

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
