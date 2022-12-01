export interface Organizations {
  '@graph': {
    '@id': string;
    '@type': string;
    parentOrganization: string;
    prefLabel: {
      '@language': string;
      '@value': string;
    }[];
    homepage: string;
  }[];
  '@context': {
    homepage: {
      '@id': string;
    };
    prefLabel: {
      '@id': string;
    };
    parentOrganization: {
      '@id': string;
    };
    iow: string;
    skos: string;
    dcterms: string;
    foaf: string;
  };
}
