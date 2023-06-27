/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppState } from '@app/store';

interface FuncProps {
  state: AppState;
  reduxKey: keyof AppState;
  functionKey: string;
}

export function getStoreData({ state, reduxKey, functionKey }: FuncProps) {
  const data = state[reduxKey] as any;

  if (typeof data !== 'undefined' && Object.keys(data).includes('queries')) {
    const key = Object.keys(data.queries).filter((k) =>
      k.includes(functionKey)
    )?.[0];

    return key ? data.queries[key].data : {};
  }

  return {};
}
