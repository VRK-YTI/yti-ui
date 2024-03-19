export enum Format {
  Jsonschema = 'JSONSCHEMA',
  Csv = 'CSV',
  Skosrdf = 'SKOSRDF',
  Pdf = 'PDF',
  Xsd = 'XSD',
  Xml = 'XML',
  Xslt = 'XSLT',
  Shacl = 'SHACL',
  Mscr = 'MSCR',
  Rdfs = 'RDFS'
}

export const formatsAvailableForCrosswalkCreation: Format[] = [
  Format.Jsonschema,
  Format.Csv,
  Format.Skosrdf,
  Format.Xsd,
  Format.Shacl,
  Format.Rdfs
];

export const formatsAvailableForCrosswalkRegistration: Format[] = [
  Format.Xslt,
  Format.Csv,
  Format.Pdf,
];
