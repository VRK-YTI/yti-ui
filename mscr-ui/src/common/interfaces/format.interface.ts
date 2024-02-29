export enum Format {
  Jsonschema = 'JSONSCHEMA',
  Csv = 'CSV',
  Skosrdf = 'SKOSRDF',
  Pdf = 'PDF',
  Xsd = 'XSD',
  Xml = 'XML',
  Xslt = 'XSLT',
  Mscr = 'MSCR',
}

export const formatsAvailableForCrosswalkCreation: Format[] = [
  Format.Jsonschema,
  Format.Csv,
  Format.Skosrdf,
  Format.Xsd,
];

export const formatsAvailableForCrosswalkRegistration: Format[] = [
  Format.Xslt, Format.Csv, Format.Pdf,
];
