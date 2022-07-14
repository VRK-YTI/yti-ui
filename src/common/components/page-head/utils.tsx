import { AppState } from '@app/store';

interface FuncProps {
  state: AppState;
  reduxKey: keyof AppState;
  functionKey: string;
}

export function getStoreData({ state, reduxKey, functionKey }: FuncProps) {
  const key = Object.keys(state[reduxKey]?.queries ?? {}).filter((k) =>
    k.includes(functionKey)
  )?.[0];

  if (!key) {
    return {};
  }

  return state[reduxKey].queries[key].data;
}
