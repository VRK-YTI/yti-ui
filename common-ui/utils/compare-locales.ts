export function compareLocales(locale1: string, locale2: string): number {
  // const t1Lang = typeof t1 === 'object' ? t1.lang.toLowerCase() : t1;
  //const t2Lang = typeof t2 === 'object' ? t2.lang.toLowerCase() : t2;

  if (locale1 === 'fi' || locale2 === 'fi') {
    return locale1 === 'fi' ? -1 : 1;
  }

  if (locale1 === 'sv' || locale2 === 'sv') {
    return locale1 === 'sv' ? -1 : 1;
  }

  if (locale1 === 'en' || locale2 === 'en') {
    return locale1 === 'en' ? -1 : 1;
  }

  if (locale1 !== locale2) {
    return locale1 > locale2 ? 1 : -1;
  }

  return 0;
}
