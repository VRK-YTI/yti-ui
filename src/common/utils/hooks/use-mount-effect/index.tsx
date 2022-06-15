import { useState } from 'react';

export default function useMountEffect(callback: () => void) {
  const [isExecuted, setExecuted] = useState(false);

  if (!isExecuted) {
    callback();
    setExecuted(true);
  }
}
