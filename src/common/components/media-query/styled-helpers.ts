import { Breakpoint } from './media-query-context';

export function resolve(
  breakpoint: Breakpoint,
  small: string,
  medium: string,
  large: string
): string {
  return { small, medium, large }[breakpoint];
}

export function small(
  breakpoint: Breakpoint,
  small: string,
  mediumAndLarge: string
): string {
  return resolve(breakpoint, small, mediumAndLarge, mediumAndLarge);
}

export function medium(
  breakpoint: Breakpoint,
  medium: string,
  smallAndLarge: string
): string {
  return resolve(breakpoint, smallAndLarge, medium, smallAndLarge);
}

export function large(
  breakpoint: Breakpoint,
  large: string,
  smallAndMedium: string
): string {
  return resolve(breakpoint, smallAndMedium, smallAndMedium, large);
}

export function mediumUp(
  breakpoint: Breakpoint,
  mediumAndLarge: string,
  small: string
): string {
  return resolve(breakpoint, small, mediumAndLarge, mediumAndLarge);
}

export function mediumDown(
  breakpoint: Breakpoint,
  smallAndMedium: string,
  large: string
): string {
  return resolve(breakpoint, smallAndMedium, smallAndMedium, large);
}
