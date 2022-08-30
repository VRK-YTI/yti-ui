import { NewTerminology } from '@app/common/interfaces/new-terminology';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { v4 } from 'uuid';

interface GenerateNewTerminologyProps {
  data: NewTerminologyInfo;
  code?: string;
  createdBy?: string;
  createdDate?: string;
  id?: string;
  lastModifiedBy?: string;
  terminologyId?: string;
  uri?: string;
}

export default function generateNewTerminology({
  data,
  code,
  createdBy,
  createdDate,
  id,
  lastModifiedBy,
  terminologyId,
  uri,
}: GenerateNewTerminologyProps) {
  if (!data.contributors) {
    return;
  }

  const postData = Object.assign({}, template);
  const regex = '(?s)^.*$';

  const now = new Date();
  const UUID = v4();
  postData.id = id ? id : UUID;
  postData.createdDate = createdDate ? createdDate : now.toISOString();
  postData.lastModifiedDate = now.toISOString();

  postData.properties.contact = [
    {
      lang: '',
      regex: regex,
      value: data.contact[0] ? data.contact[0] : 'yhteentoimivuus@dvv.fi',
    },
  ];

  postData.properties.description = data.description[0].map((desc) => ({
    lang: desc.lang,
    regex: regex,
    value: desc.description,
  }));

  postData.properties.prefLabel = data.description[0].map((desc) => ({
    lang: desc.lang,
    regex: regex,
    value: desc.name,
  }));

  postData.properties.language = data.description[0].map((desc) => ({
    lang: '',
    regex: regex,
    value: desc.lang,
  }));

  postData.properties.terminologyType = [
    {
      lang: '',
      regex: '^(OTHER_VOCABULARY|TERMINOLOGICAL_VOCABULARY)$',
      value: data.type,
    },
  ];

  postData.references.contributor = data.contributors.map((contributor) => ({
    id: contributor.uniqueItemId,
    type: {
      graph: {
        id: contributor.organizationId,
      },
      id: 'Organization',
    },
  }));

  /*
  postData.references.contributor = [
    {
      id: data.mainOrg.uniqueItemId,
      type: {
        graph: {
          id: data.mainOrg.organizationId,
        },
        id: 'Organization',
      },
    },
  ];*/

  if (terminologyId) {
    postData.references.contributor[0].type.uri = '';
  }

  postData.references.inGroup = data.infoDomains.map((infoDomain) => {
    const obj: NewTerminology['references']['inGroup'][0] = {
      id: infoDomain.uniqueItemId,
      type: {
        graph: {
          id: infoDomain.groupId,
        },
        id: 'Group',
      },
    };

    if (terminologyId) {
      obj.type.uri = '';
    }

    return obj;
  });

  postData.createdBy = createdBy ? createdBy : '';
  postData.lastModifiedBy = lastModifiedBy ? lastModifiedBy : '';

  if (code) {
    postData.code = code;
  }

  if (terminologyId) {
    postData.type.uri = '';
    postData.type.graph.id = terminologyId;
    postData.properties.origin = [
      {
        lang: '',
        regex: regex,
        value: '',
      },
    ];
  }

  if (uri) {
    postData.uri = uri;
  }

  return postData;
}

const template: NewTerminology = {
  createdBy: '',
  createdDate: '',
  id: '',
  lastModifiedBy: '',
  lastModifiedDate: '',
  properties: {
    contact: [],
    description: [],
    language: [],
    prefLabel: [],
    priority: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: '',
      },
    ],
    status: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: 'DRAFT',
      },
    ],
    terminologyType: [
      {
        lang: '',
        regex: '^(OTHER_VOCABULARY|TERMINOLOGICAL_VOCABULARY)$',
        value: 'TERMINOLOGICAL_VOCABULARY',
      },
    ],
  },
  references: {
    contributor: [],
    inGroup: [],
  },
  referrers: {},
  type: {
    graph: {
      // Default value for TerminologicalVocabulary nodes
      id: '61cf6bde-46e6-40bb-b465-9b2c66bf4ad8',
    },
    id: 'TerminologicalVocabulary',
    uri: 'http://www.w3.org/2004/02/skos/core#ConceptScheme',
  },
};
