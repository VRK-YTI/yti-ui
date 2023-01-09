import { Term } from '../interfaces/term.interface';
import { Property } from '../interfaces/termed-data-types.interface';

export interface TermBlockType {
  term: Term;
  type: string;
}

// Prioritizes Finnish and Swedish over other languages
export function compareLocales(
  t1: TermBlockType | Property,
  t2: TermBlockType | Property
): number {
  const t1Lang =
    'regex' in t1
      ? t1.lang.toLowerCase()
      : t1.term.properties.prefLabel?.[0].lang.toLowerCase() ?? '';
  const t2Lang =
    'regex' in t2
      ? t2.lang.toLowerCase()
      : t2.term.properties.prefLabel?.[0].lang.toLowerCase() ?? '';

  if (t1Lang === 'fi' || t2Lang === 'fi') {
    return t1Lang === 'fi' ? -1 : 1;
  }

  if (t1Lang === 'sv' || t2Lang === 'sv') {
    return t1Lang === 'sv' ? -1 : 1;
  }

  if (t1Lang !== t2Lang) {
    return t1Lang > t2Lang ? 1 : -1;
  }

  return 0;
}
