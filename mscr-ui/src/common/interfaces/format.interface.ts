export type Format =
  | 'JSONSCHEMA'
  | 'CSV'
  | 'SKOSRDF'
  | 'PDF'
  | 'XSD'
  | 'XML'
  | 'XLST'
  | 'MSCR';

export const formatsAvailableForCrosswalkCreation: Format[] = [
  'JSONSCHEMA',
  'CSV',
  'SKOSRDF',
];
