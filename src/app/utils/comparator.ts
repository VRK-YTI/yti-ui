/*
 * NOTE: This is a hackish copy from yti-common-ui to work around optimizer problems with text-analyzer.tx.
 *
 * TODO: REMOVE THIS FILE WHEN ISSUES HAVE BEEN SORTED OUT!
 */


import { Optional, isDefined } from 'yti-common-ui/utils/object';
import { Localizable } from 'yti-common-ui/types/localization';
import { Localizer } from 'yti-common-ui/types/localization';

export type Comparator<T> = (lhs: T, rhs: T) => number;

export interface ChainableComparator<T> extends Comparator<T> {
  andThen(other: Comparator<T>): ChainableComparator<T>;
}

export function reversed<T>(comparator: Comparator<T>): ChainableComparator<T> {
  return makeChainable((lhs: T, rhs: T) => comparator(rhs, lhs));
}

export function comparingPrimitive<T>(propertyExtractor: (item: T) => Optional<string|number|boolean>): ChainableComparator<T> {
  return makeChainable(property(propertyExtractor, optional(primitiveComparator)));
}

export function comparingLocalizable<T>(localizer: Localizer, propertyExtractor: (item: T) => Optional<Localizable>, useUILanguage = true): ChainableComparator<T> {
  return makeChainable(property(propertyExtractor, optional(localized(localizer, useUILanguage, stringComparatorIgnoringCase))));
}

export function primitiveComparator<T extends string|number|boolean>(lhs: T, rhs: T): number {
  return lhs === rhs ? 0 : lhs > rhs ? 1 : -1;
}

export function stringComparatorIgnoringCase(lhs: string, rhs: string) {
  return primitiveComparator(lhs.toLowerCase(), rhs.toLowerCase());
}

export function localized<T extends Localizable>(localizer: Localizer, useUILanguage: boolean, localizedComparator: Comparator<string> = primitiveComparator): Comparator<T> {
  return (lhs: T, rhs: T) => localizedComparator(localizer.translate(lhs, useUILanguage), localizer.translate(rhs, true));
}

export function property<T, P>(propertyExtractor: (item: T) => P, propertyComparator: Comparator<P>): Comparator<T> {
  return (lhs: T, rhs: T) => propertyComparator(propertyExtractor(lhs), propertyExtractor(rhs));
}

export function optional<T>(comparator: Comparator<T>): Comparator<Optional<T>> {
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

export function makeChainable<T>(comparator: Comparator<T>): ChainableComparator<T> {
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
