import React, { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export interface ClickOutsideListenerProps {
  children?: React.ReactNode;
  onClickOutside: () => void;
}

export default function ClickOutsideListener({
  children,
  onClickOutside,
}: ClickOutsideListenerProps) {
  const ref = useRef(null);
  useOnClickOutside(ref, onClickOutside);

  return <div ref={ref}>{children}</div>;
}
