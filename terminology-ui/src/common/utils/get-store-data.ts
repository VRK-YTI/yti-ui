/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppState } from '@app/store';

interface FuncProps {
  state: AppState;
  reduxKey: keyof AppState;
  functionKey: string;
}

// Unfortunately we need to mark state[reduxKey] as any
// because RTK slice reducers are always taken into consideration.
// This causes a problem where we could have empty objects ({})
// that cannot be filtered in a way that TS understands.
export function getStoreData({ state, reduxKey, functionKey }: FuncProps) {
  if (Object.keys(state[reduxKey]).includes('queries')) {
    const key = Object.keys((state[reduxKey] as any).queries).filter((k) =>
      k.includes(functionKey)
    )?.[0];

    return key ? (state[reduxKey] as any).queries[key].data : {};
  }

  return {};
}
