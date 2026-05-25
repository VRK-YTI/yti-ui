import React, { useEffect, useRef } from 'react';

export interface ClickOutsideListenerProps {
  children?: React.ReactNode;
  onClickOutside: () => void;
}

export default function ClickOutsideListener({
  children,
  onClickOutside,
}: ClickOutsideListenerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClickOutside]);

  return <div ref={ref}>{children}</div>;
}
