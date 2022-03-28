export default function postTerminology() {}

const template = {
  createdBy: '',
  createdDate: '',
  id: '',
  lastModifiedBy: '',
  lastModifiedDate: '',
  properties: {
    contact: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: '<email>',
      },
    ],
    description: [
      {
        lang: '<lang>',
        regex: '(?s)^.*$',
        value: '<desc>',
      },
    ],
    language: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: '<fi | en | sv>',
      },
    ],
    prefLabel: [
      {
        lang: '<lang>',
        regex: '(?s)^.*$',
        value: '<label>',
      },
    ],
    priority: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: '<prio>',
      },
    ],
    status: [
      {
        lang: '',
        regex: '(?s)^.*$',
        value: '<status>',
      },
    ],
  },
  references: {
    contributor: [
      {
        id: '<id>',
        type: {
          graph: {
            id: '<id>',
          },
          id: 'Organization',
        },
      },
    ],
    inGroup: [
      {
        id: '<id>',
        type: {
          graph: {
            id: '<id>',
          },
          id: 'Group',
        },
      },
    ],
  },
  referrers: {},
  type: {
    graph: {
      id: '<id>',
    },
    id: 'TerminologicalVocabulary',
    uri: 'http://www.w3.org/2004/02/skos/core#ConceptScheme',
  },
};
