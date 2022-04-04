import { NewTerminology } from '@app/common/interfaces/new-terminology';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { v4 } from 'uuid';

interface GenerateNewTerminologyProps {
  data: NewTerminologyInfo;
}

export default function generateNewTerminology({ data }: GenerateNewTerminologyProps) {
  const postData = Object.assign({}, template);
  const regex = '(?s)^.*$';
  console.log(data);

  const now = new Date();
  const UUID = v4();
  postData.id = UUID;
  postData.createdDate = now.toISOString();
  postData.lastModifiedDate = now.toISOString();

  postData.properties.contact = [
    {
      lang: '',
      regex: regex,
      value: data.contact[0]
    }
  ];

  data.description[0].map(desc => {
    postData.properties.description = [
      ...postData.properties.description,
      {
        lang: desc.lang,
        regex: regex,
        value: desc.description
      }
    ];

    postData.properties.prefLabel = [
      ...postData.properties.prefLabel,
      {
        lang: desc.lang,
        regex: regex,
        value: desc.name,
      }
    ];

    postData.properties.language = [
      ...postData.properties.language,
      {
        lang: '',
        regex: regex,
        value: desc.lang,
      }
    ];
  });

  postData.references.contributor = [
    {
      id: data.mainOrg.uniqueItemId,
      type: {
        graph: {
          id: data.mainOrg.organizationId,
        },
        id: 'Organization'
      }
    }
  ];

  data.infoDomains.map(infoDomain => {
    postData.references.inGroup = [
      ...postData.references.inGroup,
      {
        id: infoDomain.uniqueItemId,
        type: {
          graph: {
            id: infoDomain.groupId,
          },
          id: 'Group'
        }
      }
    ];
  });

  console.log(postData);
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
  },
  references: {
    contributor: [],
    inGroup: [],
  },
  referrers: {},
  type: {
    graph: {
      id: '61cf6bde-46e6-40bb-b465-9b2c66bf4ad8',
    },
    id: 'TerminologicalVocabulary',
    uri: 'http://www.w3.org/2004/02/skos/core#ConceptScheme',
  },
};
