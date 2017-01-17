import { isDefined } from './object';

export function normalizeAsArray<T>(obj: T|T[]): T[] {
  return Array.isArray(obj) ? obj : isDefined(obj) ? [obj] : [];
}

export function index<T, TIndex>(items: T[], indexExtractor: (item: T) => TIndex): Map<TIndex, T> {
  const result = new Map<TIndex, T>();

  for (const item of items) {
    result.set(indexExtractor(item), item);
  }

  return result;
}

export function filterDefined<T>(items: (T|undefined)[]): T[] {

  const result: T[] = [];

  for (const item of items) {
    if (item) {
      result.push(item);
    }
  }

  return result;
}


export function flatten<T>(arr: T[][]): T[] {
  const result: T[] = [];

  for (const outer of arr) {
    for (const inner of outer) {
      result.push(inner);
    }
  }

  return result;
}
