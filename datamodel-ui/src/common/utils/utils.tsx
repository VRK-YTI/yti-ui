/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppState } from '@app/store';
import {
  InternalNamespace,
  ModelCodeList,
  ModelTerminology,
} from '../interfaces/model.interface';
import { getLanguageVersion } from './get-language-version';

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

export type LabelComparable =
  | InternalNamespace
  | ModelCodeList
  | ModelTerminology;

export function compareLabels(
  a: LabelComparable,
  b: LabelComparable,
  lang: string
) {
  let data1;
  let data2;
  if ('name' in a && 'name' in b) {
    data1 = a.name;
    data2 = b.name;
  } else if ('label' in a && 'label' in b) {
    data1 = a.label;
    data2 = b.label;
  } else if ('prefLabel' in a && 'prefLabel' in b) {
    data1 = a.prefLabel;
    data2 = b.prefLabel;
  } else {
    return 0;
  }

  const label1 = getLanguageVersion({ data: data1, lang }).toUpperCase();
  const label2 = getLanguageVersion({ data: data2, lang }).toUpperCase();

  return label1.localeCompare(label2);
}
