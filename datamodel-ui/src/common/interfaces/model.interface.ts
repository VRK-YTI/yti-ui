import { Status } from './status.interface';

export interface IdObject {
  '@id': string;
}

export interface IdTypeObject {
  '@id': string;
  '@type': string;
}

export interface LangObject {
  '@language': string;
  '@value': string;
}

export interface BaseInfo {
  '@id': string;
  '@type': string[];
  comment?: LangObject | LangObject[];
  contact?: LangObject;
  contributor: string | string[];
  created: string;
  'dcterms:language': {
    '@list': string[];
  };
  documentation?: LangObject;
  identifier: string;
  isPartOf: string | string[];
  label: LangObject | LangObject[];
  modified: string;
  preferredXMLNamespaceName: string;
  preferredXMLNamespacePrefix: string;
  relation?: {
    '@list': string[];
  };
  statusModified: string;
  useContext: string;
  versionInfo: Status;
}

export interface DataVocabulary {
  '@id': string;
  '@type': string[];
  label: LangObject | LangObject[];
  preferredXMLNamespaceName: string[];
  preferredXMLNamespacePrefix: string;
}

export interface Group {
  '@id': string;
  '@type': string;
  identifier: string;
  label: LangObject[];
}

export interface Organization {
  '@id': string;
  '@type': string;
  parentOrganization: string;
  prefLabel: LangObject[];
}

// Note: This might need a more descriptive name
export interface Link {
  '@id': string;
  description: LangObject;
  homepage: string;
  title: LangObject;
}

export interface Terminology {
  '@id': string;
  '@type': string;
  modified: string;
  prefLabel: LangObject | LangObject[];
  versionInfo: Status;
}

export interface ReferenceData {
  '@id': string;
  '@type': string;
  creator: string;
  description: LangObject | LangObject[];
  identifier: string;
  isPartOf: string | string[];
  status: Status;
  title: LangObject | LangObject[];
}

export interface Model {
  '@context': {
    adms: string;
    afn: string;
    at: string;
    comment?: IdObject;
    contact?: IdObject;
    contributor: IdTypeObject;
    created: IdTypeObject;
    dc: string;
    dcam: string;
    dcap: string;
    dcterms: string;
    description?: IdObject;
    documentation?: IdObject;
    first: IdObject;
    foaf: string;
    homepage?: IdObject;
    httpv: string;
    identifier: IdObject;
    iow: string;
    isPartOf: IdTypeObject;
    label: IdObject;
    language: IdTypeObject;
    modified: IdTypeObject;
    owl: string;
    parentOrganization: IdObject;
    prefLabel: IdObject;
    preferredXMLNamespaceName: IdObject;
    preferredXMLNamespacePrefix: IdObject;
    prov: string;
    rdf: string;
    rdfs: string;
    relation?: IdTypeObject;
    rest: IdTypeObject;
    schema: string;
    sd: string;
    sh: string;
    skos: string;
    skosxl: string;
    statusModified: IdTypeObject;
    text: string;
    title?: IdObject;
    ts: string;
    useContext: IdObject;
    versionInfo: IdObject;
    void: string;
    xsd: string;
  };
  '@graph': (
    | BaseInfo
    | DataVocabulary
    | Link
    | Group
    | Organization
    | Terminology
    | ReferenceData
  )[];
}

export const initialModel: Model = {
  '@context': {
    adms: 'adms',
    afn: 'afn',
    at: 'at',
    comment: {
      '@id': 'comment-id',
    },
    contact: {
      '@id': 'contact-id',
    },
    contributor: {
      '@id': 'contributor-id',
      '@type': 'contributor-type',
    },
    created: {
      '@id': 'created-id',
      '@type': 'created-type',
    },
    dc: 'dc',
    dcam: 'dcam',
    dcap: 'dcap',
    dcterms: 'dcterms',
    description: {
      '@id': 'description-id',
    },
    documentation: {
      '@id': 'documentation-id',
    },
    first: {
      '@id': 'first-id',
    },
    foaf: 'foaf',
    homepage: {
      '@id': 'homepage-id',
    },
    httpv: 'httpv',
    identifier: {
      '@id': 'identifier-id',
    },
    iow: 'iow',
    isPartOf: {
      '@id': 'isPartOf-id',
      '@type': 'isPartOf-type',
    },
    label: {
      '@id': 'label-id',
    },
    language: {
      '@id': 'language-id',
      '@type': 'language-type',
    },
    modified: {
      '@id': 'modified-id',
      '@type': 'modified-type',
    },
    owl: 'owl',
    parentOrganization: {
      '@id': 'parentOrganization-id',
    },
    prefLabel: {
      '@id': 'prefLabel-id',
    },
    preferredXMLNamespaceName: {
      '@id': 'preferredXMLNamespaceName-id',
    },
    preferredXMLNamespacePrefix: {
      '@id': 'preferredXMLNamespacePrefix-id',
    },
    prov: 'prov',
    rdf: 'rdf',
    rdfs: 'rdfs',
    relation: {
      '@id': 'relation-id',
      '@type': 'relation-type',
    },
    rest: {
      '@id': 'rest-id',
      '@type': 'rest-type',
    },
    schema: 'schema',
    sd: 'sd',
    sh: 'sh',
    skos: 'skos',
    skosxl: 'skosxl',
    statusModified: {
      '@id': 'statusModified-id',
      '@type': 'statusModified-type',
    },
    text: 'text',
    title: {
      '@id': 'title-id',
    },
    ts: 'ts',
    useContext: {
      '@id': 'useContext-id',
    },
    versionInfo: {
      '@id': 'versionInfo-id',
    },
    void: 'void',
    xsd: 'xsd',
  },
  '@graph': [
    // Base information
    {
      '@id': 'model-id',
      '@type': ['dcap:DCAP', 'owl:Ontology'],
      comment: [
        {
          '@language': 'en',
          '@value': 'comment-en',
        },
        {
          '@language': 'fi',
          '@value': 'comment-fi',
        },
      ],
      contact: {
        '@language': 'fi',
        '@value': 'contact-fi',
      },
      contributor: ['contributor-1', 'contributor-2'],
      created: 'created date',
      'dcterms:language': {
        '@list': ['en', 'fi'],
      },
      documentation: {
        '@language': 'fi',
        '@value': 'documentation-fi',
      },
      identifier: 'identifier',
      isPartOf: ['isPart-1', 'isPart-2'],
      label: [
        {
          '@language': 'en',
          '@value': 'label-en',
        },
        {
          '@language': 'fi',
          '@value': 'label-fi',
        },
      ],
      modified: 'modified date',
      preferredXMLNamespaceName:
        'http://uri.suomi.fi/datamodel/ns/testcase123#',
      preferredXMLNamespacePrefix: 'testcase123',
      relation: {
        '@list': ['relation-1'],
      },
      statusModified: 'status modified date',
      useContext: 'context',
      versionInfo: 'VALID',
    },

    // Groups / Information domains
    {
      '@id': 'group-id-1',
      '@type': 'group',
      identifier: 'group-1',
      label: [
        {
          '@language': 'fi',
          '@value': 'group-1-name-fi',
        },
        {
          '@language': 'en',
          '@value': 'group-1-name-en',
        },
      ],
    },
    {
      '@id': 'group-id-2',
      '@type': 'group',
      identifier: 'group-2',
      label: [
        {
          '@language': 'fi',
          '@value': 'group-2-name-fi',
        },
        {
          '@language': 'en',
          '@value': 'group-2-name-en',
        },
      ],
    },

    // Organizations
    {
      '@id': 'organization-id-1',
      '@type': 'organization',
      parentOrganization: '',
      prefLabel: [
        {
          '@language': 'fi',
          '@value': 'organization-1-name-fi',
        },
        {
          '@language': 'en',
          '@value': 'organization-1-name-en',
        },
      ],
    },
    {
      '@id': 'organization-id-2',
      '@type': 'organization',
      parentOrganization: '',
      prefLabel: [
        {
          '@language': 'fi',
          '@value': 'organization-2-name-fi',
        },
        {
          '@language': 'en',
          '@value': 'organization-2-name-en',
        },
      ],
    },

    // Links
    {
      '@id': 'link-1',
      description: {
        '@language': 'fi',
        '@value': 'link-description-fi',
      },
      homepage: 'https://suomi.fi',
      title: {
        '@language': 'fi',
        '@value': 'link-title-fi',
      },
    },
  ],
};
