import { Optional, isDefined } from './object';
import { Localizable } from '../entities/localization';
import { Localizer } from '../services/language.service';

export interface Comparator<T> {
  (lhs: T, rhs: T): number;
}

export interface ChainableComparator<T> extends Comparator<T> {
  andThen(other: Comparator<T>): ChainableComparator<T>;
}

export function reversed<T>(comparator: Comparator<T>): ChainableComparator<T> {
  return makeChainable((lhs: T, rhs: T) => comparator(rhs, lhs));
}

export function comparingPrimitive<T>(propertyExtractor: (item: T) => Optional<string|number|boolean>): ChainableComparator<T> {
  return makeChainable(property(propertyExtractor, optional(primitiveComparator)));
}

export const comparingNumber = comparingPrimitive;
export const comparingString = comparingPrimitive;
export const comparingBoolean = comparingPrimitive;

export function comparingLocalizable<T>(localizer: Localizer, propertyExtractor: (item: T) => Optional<Localizable>): ChainableComparator<T> {
  return makeChainable(property(propertyExtractor, optional(localized(localizer, stringComparatorIgnoringCase))));
}

function primitiveComparator<T extends string|number|boolean>(lhs: T, rhs: T) {
  return lhs === rhs ? 0 : lhs > rhs ? 1 : -1;
}

function stringComparatorIgnoringCase(lhs: string, rhs: string) {
  return primitiveComparator(lhs.toLowerCase(), rhs.toLowerCase());
}

function localized<T extends Localizable>(localizer: Localizer, localizedComparator: Comparator<string> = primitiveComparator): Comparator<T> {
  return (lhs: T, rhs: T) => localizedComparator(localizer.translate(lhs), localizer.translate(rhs));
}

function property<T, P>(propertyExtractor: (item: T) => P, propertyComparator: Comparator<P>): Comparator<T> {
  return (lhs: T, rhs: T) => propertyComparator(propertyExtractor(lhs), propertyExtractor(rhs));
}

function optional<T>(comparator: Comparator<T>): Comparator<Optional<T>> {
  return (lhs: Optional<T>, rhs: Optional<T>) => {
    if (isDefined(lhs) && !isDefined(rhs)) {
      return 1;
    } else if (!isDefined(lhs) && isDefined(rhs)) {
      return -1;
    } else {
      return comparator(lhs!, rhs!);
    }
  };
}

function makeChainable<T>(comparator: Comparator<T>): ChainableComparator<T> {
  (<any> comparator).andThen = (next: Comparator<T>) => makeChainable(chain(comparator, next));
  return <ChainableComparator<T>> comparator;
}

function chain<T>(current: Comparator<T>, next: Comparator<T>): Comparator<T> {
  return (lhs: T, rhs: T) => {
    const currentComparison = current(lhs, rhs);
    if (currentComparison !== 0) {
      return currentComparison;
    } else {
      return next(lhs, rhs);
    }
  };
}
