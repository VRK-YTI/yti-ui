// Prioritizes Finnish and Swedish over other languages
export function compareLocales(locale1: string, locale2: string): number {
  const l1 = locale1.toLowerCase();
  const l2 = locale2.toLowerCase();

  if (l1 === 'fi' || l2 === 'fi') {
    return l1 === 'fi' ? -1 : 1;
  }

  if (l1 === 'sv' || l2 === 'sv') {
    return l1 === 'sv' ? -1 : 1;
  }

  if (l1 !== l2) {
    return l1 > l2 ? 1 : -1;
  }

  return 0;
}
