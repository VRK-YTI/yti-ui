export type Optional<T> = T|null|undefined;

export type EqualityChecker<T> = (lhs: T, rhs: T) => boolean;

export function referenceEquality<T>(lhs: T, rhs: T) {
  return lhs === rhs;
}

export function areEqual<T>(lhs: Optional<T>, rhs: Optional<T>, equals: EqualityChecker<T> = referenceEquality): boolean {
  if ((isDefined(lhs) && !isDefined(rhs)) || (!isDefined(lhs) && isDefined(rhs))) {
    return false;
  } else if (!isDefined(lhs) && !isDefined(rhs)) {
    return true;
  } else {
    return equals(lhs!, rhs!);
  }
}

export function isDefined<T>(obj: Optional<T>): obj is T {
  return obj !== null && obj !== undefined;
}

export function requireDefined<T>(obj: Optional<T>, msg?: string): T {
  if (!isDefined(obj)) {
    throw new Error('Object must not be null or undefined: ' + msg);
  }
  return obj;
}
