export type Optional<T> = T|null|undefined;

export function isDefined<T>(obj: Optional<T>): obj is T {
  return obj !== null && obj !== undefined;
}

export function requireDefined<T>(obj: Optional<T>, msg?: string): T {
  if (!isDefined(obj)) {
    throw new Error('Object must not be null or undefined: ' + msg);
  }
  return obj;
}
