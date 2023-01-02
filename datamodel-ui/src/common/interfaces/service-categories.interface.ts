export interface ServiceCategories {
  '@graph': {
    '@id': string;
    '@type': string;
    description: {
      '@language': string;
      '@value': string;
    }[];
    identifier: string;
    label: {
      '@language': string;
      '@value': string;
    }[];
    order: string;
  }[];
  '@context': {
    order: {
      '@id': string;
    };
    identifier: {
      '@id': string;
    };
    description: {
      '@id': string;
    };
    label: {
      '@id': string;
    };
    dcap: string;
    schema: string;
    void: string;
    adms: string;
    dcam: string;
    skosxl: string;
    owl: string;
    afn: string;
    xsd: string;
    skos: string;
    rdfs: string;
    iow: string;
    sd: string;
    at: string;
    sh: string;
    rdf: string;
    dcterms: string;
    text: string;
    prov: string;
    httpv: string;
    foaf: string;
    ts: string;
    dc: string;
  };
}

export const InitialServiceCategories: ServiceCategories = {
  '@graph': [],
  '@context': {
    order: {
      '@id': '',
    },
    identifier: {
      '@id': '',
    },
    description: {
      '@id': '',
    },
    label: {
      '@id': '',
    },
    dcap: '',
    schema: '',
    void: '',
    adms: '',
    dcam: '',
    skosxl: '',
    owl: '',
    afn: '',
    xsd: '',
    skos: '',
    rdfs: '',
    iow: '',
    sd: '',
    at: '',
    sh: '',
    rdf: '',
    dcterms: '',
    text: '',
    prov: '',
    httpv: '',
    foaf: '',
    ts: '',
    dc: '',
  },
};
