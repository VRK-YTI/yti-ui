import { useState } from 'react';

export default function useMountEffect(callback: () => void, skip?: boolean) {
  const [isExecuted, setExecuted] = useState(false);

  if (!isExecuted) {
    !skip && callback();
    setExecuted(true);
  }
}
