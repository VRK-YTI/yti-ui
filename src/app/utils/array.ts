import { isDefined, EqualityChecker } from './object';

export function limit<T>(arr: T[], limit: number): T[] {
  return arr.slice(0, Math.min(limit, arr.length));
}

export function filter<T, R extends T>(arr: T[], predicate: (item: T) => item is R): R[] {
  const result: R[] = [];

  for (const item of arr) {
    if (predicate(item)) {
      result.push(item);
    }
  }

  return result;
}

export function normalizeAsArray<T>(obj: T|T[]|undefined): T[] {
  return Array.isArray(obj) ? obj : isDefined(obj) ? [obj] : [];
}

export function collectProperties<T, TResult>(items: T[]|T[][], propertyExtractor: (item: T) => TResult): Set<TResult> {
  const result = new Set<TResult>();
  for (const item of items) {
    if (Array.isArray(item)) {
      for (const innerItem of item) {
        result.add(propertyExtractor(innerItem));
      }
    } else {
      result.add(propertyExtractor(item));
    }
  }
  return result;
}

export function index<T, TIndex>(items: T[], indexExtractor: (item: T) => TIndex): Map<TIndex, T> {
  const result = new Map<TIndex, T>();

  for (const item of items) {
    result.set(indexExtractor(item), item);
  }

  return result;
}

export function referenceEquality<T>(lhs: T, rhs: T) {
  return lhs === rhs;
}

export function any<T>(arr: T[], predicate: (item: T) => boolean) {
  for (const item of arr) {
    if (predicate(item)) {
      return true;
    }
  }
  return false;
}

export function all<T>(arr: T[], predicate: (item: T) => boolean) {
  for (const item of arr) {
    if (!predicate(item)) {
      return false;
    }
  }
  return true;
}

export function first<T>(arr: T[], predicate: (item: T) => boolean): T|null {
  for (const item of arr) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}

export function contains<T>(arr: T[], value: T, equals: EqualityChecker<T> = referenceEquality): boolean {
  return any(arr, (item: T) => equals(item, value));
}

export function containsAny<T>(arr: T[], values: T[], equals: EqualityChecker<T> = referenceEquality): boolean {
  return any(values, (value: T) => contains(arr, value, equals));
}

export function containsAll<T>(arr: T[], values: T[], equals: EqualityChecker<T> = referenceEquality): boolean {
  return all(values, (value: T) => contains(arr, value, equals));
}

export function arraysAreEqual<T>(lhs: T[], rhs: T[], equals: EqualityChecker<T> = referenceEquality) {
  return containsAll(lhs, rhs, equals) && containsAll(rhs, lhs, equals);
}

export function findFirstMatching<T>(arr: T[], values: T[], equals: EqualityChecker<T> = referenceEquality): T|null {
  return first(arr, item => contains(values, item, equals));
}

// return true if removed
export function removeMatching<T>(arr: T[], predicate: (item: T) => boolean) {

  const matchingIndices: number[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i];
    if (predicate(item)) {
      matchingIndices.push(i);
    }
  }

  for (const index of matchingIndices) {
    arr.splice(index, 1);
  }

  return matchingIndices.length > 0;
}

// returns true is replaced
export function replaceMatching<T>(arr: T[], predicate: (item: T) => boolean, replaceWith: T) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      arr[i] = replaceWith;
      return true;
    }
  }
  return false;
}

export function keepMatching<T>(arr: T[], predicate: (item: T) => boolean) {
  removeMatching(arr, item => !predicate(item));
}

export function remove<T>(arr: T[], item: T): void {
  removeMatching(arr, i => i === item);
}

export function flatten<T>(arr: T[][]) {

  const result: T[] = [];

  for (const innerArr of arr) {
    for (const item of innerArr) {
      result.push(item);
    }
  }

  return result;
}

export function groupBy<T, I>(arr: T[], indexByExtractor: (item: T) => I): Map<I, T[]> {

  const result = new Map<I, T[]>();

  function createOrGet(indexProperty: I): T[] {
    const resultList = result.get(indexProperty);

    if (resultList) {
      return resultList;
    } else {
      const newResultList: T[] = [];
      result.set(indexProperty, newResultList);
      return newResultList;
    }
  }

  for (const item of arr) {
    createOrGet(indexByExtractor(item)).push(item);
  }

  return result;
}

export function requireSingle<T>(arr: T[]): T {
  if (arr.length !== 1) {
    throw new Error('Single element required, was: ' + arr.length);
  }

  return arr[0];
}
