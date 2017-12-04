import { normalizeAsArray } from './array';

export function hasAny<T>(set: Set<T>, values: T|T[]) {

  for (const value of normalizeAsArray(values)) {
    if (set.has(value)) {
      return true;
    }
  }

  return false;
}

export function combineResultSets<K, V>(map: Map<K, Set<V>>, keys: K|K[]): Set<V> {
  return combineSets(normalizeAsArray(keys).map(key => map.get(key) || new Set<V>()))
}

export function combineSets<T>(sets: Set<T>[]): Set<T> {

  switch (sets.length) {
    case 0:
      return new Set<T>();
    case 1:
      return sets[0];
    default:
      const result = new Set<T>();

      for (const set of sets) {
        set.forEach(value => result.add(value));
      }

      return result;
  }
}

export function getOrCreateSet<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {

  const set = map.get(key);

  if (set) {
    return set;
  } else {
    const newSet = new Set<V>();
    map.set(key, newSet);
    return newSet;
  }
}

export function convertToMapSet<K extends string, V extends string>(mapSetLike: { [key: string]: string[] }): Map<K, Set<V>> {

  const map = new Map<K, Set<V>>();

  for (const entry of Object.entries(mapSetLike)) {

    const key = entry[0] as K;
    const values = entry[1] as V[];
    const set = getOrCreateSet(map, key);

    for (const value of values) {
      set.add(value);
    }
  }

  return map;
}
