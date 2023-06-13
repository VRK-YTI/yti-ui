import { useEffect, useRef, useState } from 'react';

export const useGetAwayListener = (
  initialValue?: boolean,
  setTarget?: (value: boolean) => void
) => {
  const [visible, setVisible] = useState(initialValue ?? false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        initialValue &&
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        ref.current.parentElement &&
        !ref.current.parentElement.contains(event.target as Node)
      ) {
        setTarget && setTarget(false);
        setVisible(false);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref, visible, setTarget, initialValue]);

  return { ref, visible };
};
