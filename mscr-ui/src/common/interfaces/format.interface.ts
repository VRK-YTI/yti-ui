export enum Format {
  Jsonschema = 'JSONSCHEMA',
  Csv = 'CSV',
  Skosrdf = 'SKOSRDF',
  Pdf = 'PDF',
  Xsd = 'XSD',
  Owl = 'OWL',
  Xslt = 'XSLT',
  Shacl = 'SHACL',
  Mscr = 'MSCR',
  Rdfs = 'RDFS',
  Enum = 'ENUM',
  Sssom = 'SSSOM'
}

export enum FileExtensions {
  Jsonschema = 'json',
  Csv = 'csv',
  Skosrdf = 'ttl',
  Pdf = 'pdf',
  Xsd = 'xsd',
  Xslt = 'xslt',
}

export const formatsAvailableForCrosswalkCreation: Format[] = [
  Format.Jsonschema,
  Format.Csv,
  Format.Rdfs,
  Format.Skosrdf,
  Format.Xsd,
  Format.Shacl,
  Format.Owl,
  Format.Mscr,
  Format.Enum,
];

export const formatsAvailableForCrosswalkRegistration: Format[] = [
  Format.Xslt,
  Format.Csv,
  Format.Pdf,
  Format.Sssom,
];

export const formatsAvailableForSchemaRegistration: Format[] = [
  Format.Csv,
  Format.Jsonschema,
  Format.Pdf,
  Format.Rdfs,
  Format.Skosrdf,
  Format.Xsd,
  Format.Owl,
  Format.Shacl,
  Format.Enum,
];

export const formatsAvailableForMscrCopy: Format[] = [
  Format.Csv,
  Format.Jsonschema,
  Format.Mscr,
  Format.Shacl,
  Format.Xsd
];

export const fileExtensionsAvailableForCrosswalkRegistrationAttachments: FileExtensions[] =
  [FileExtensions.Csv, FileExtensions.Xslt, FileExtensions.Pdf];

export const fileExtensionsAvailableForSchemaRegistration: FileExtensions[] = [
  FileExtensions.Jsonschema,
  FileExtensions.Csv,
  FileExtensions.Skosrdf,
  FileExtensions.Pdf,
  FileExtensions.Xsd,
];

export const Roles = {
  admin: 'ADMIN',
  dataModelEditor: 'DATA_MODEL_EDITOR',
};
