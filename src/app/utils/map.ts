import { isDefined } from './object';

export function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {

  const result = map.get(key);

  if (isDefined(result)) {
    return result;
  } else {
    const created = create();
    map.set(key, created);
    return created;
  }
}
