import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { RenderTree } from '@app/common/interfaces/crosswalk-connection.interface';
import { Checkbox } from 'suomifi-ui-components';

const functionsMockup: any = [
  {
    name: 'vocabularyMapperFunc',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#vocabularyMapperFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function ',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#pickPropertyFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to copy string value as it is with one to one mapping',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#stringToStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse integer from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#stringToIntFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'int output',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: `http://uri.suomi.fi/datamodel/ns/mscr#propertiesToArrayFunc`,
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#stringToXmlObjectFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse integer from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#similarityBasedValueMappingFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse integer from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#formatUrlFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#pickPropertiesToObjectFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#simpleCoordinateToComplexFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#configurableObjectToParamsFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#configurableStringToObjectFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function ',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#pickFirstFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#staticContentFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'formatStringWithSubstitutor',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#formatStringWithSubstitutorFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#simpleReplaceStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#mapVocabulariesFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function ',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#concatenateObjectFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'concatListsFunc',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#concatListsFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse integer from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#formatStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#copyMapFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#configurableObjectToStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#formatDateFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse double from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#stringToDoubleFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'double output',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#anyToStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#pickPropertyWithJSONPathFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'testing',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#customCoordinateToStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to parse integer from string input',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#prefixStringFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'string output',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        required: true,
      },
    ],
  },
  {
    name: 'Function to transform celsius (double) to fahrenheit (double)',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#celsiusToFahrenheitFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'double output',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#clarinToFullDateFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
  {
    name: 'Function to...',
    uri: 'http://uri.suomi.fi/datamodel/ns/mscr#dataciteCreatorToB2FindFunc',
    description: '',
    parameters: [
      {
        name: 'input',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
      {
        name: 'params map',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: false,
      },
    ],
    outputs: [
      {
        name: 'object output',
        datatype: 'http://www.w3.org/2001/XMLSchema#anySimpleType',
        required: true,
      },
    ],
  },
];

const importedSchemaExample = {
  metadata: {
    created: null,
    modified: null,
    modifier: null,
    creator: null,
    type: null,
    prefix: null,
    status: null,
    label: {
      en: 'string2',
    },
    description: {
      en: 'string',
    },
    languages: [],
    organizations: [],
    groups: [],
    internalNamespaces: [],
    externalNamespaces: [],
    terminologies: [],
    codeLists: [],
    contact: null,
    documentation: {},
    state: 'DRAFT',
    visibility: 'PRIVATE',
    format: 'JSONSCHEMA',
    namespace: 'http://test.com',
    versionLabel: '1',
    revisionOf: null,
    aggregationKey: 'urn:IAMNOTAPID:55174186-1048-4ad3-9438-a04bd27919a3',
    hasRevisions: null,
    revisions: null,
    variants: null,
    variants2: null,
    owner: ['7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'],
    fileMetadata: [],
    pid: 'urn:IAMNOTAPID:55174186-1048-4ad3-9438-a04bd27919a3',
  },
  content: {
    description: 'string',
    '@id': 'urn:IAMNOTAPID:55174186-1048-4ad3-9438-a04bd27919a3#',
    title: 'string2',
    modified: 'Thu, 09 Nov 2023 10:09:34 EET',
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      lastName: {
        '@id': 'mscr:root/Root/lastName',
        title: 'lastName',
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        type: 'array',
        items: {
          type: 'string',
        },
      },
      firstName: {
        '@id': 'mscr:root/Root/firstName',
        title: 'firstName',
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        type: 'array',
        items: {
          type: 'string',
        },
      },
      address: {
        '@id': 'mscr:root/Root/address',
        title: 'Address of the person',
        '@type': '@id',
        type: 'array',
        items: {
          type: 'object',
          '@id':
            'urn:IAMNOTAPID:55174186-1048-4ad3-9438-a04bd27919a3#root/Root/address/Address',
          properties: {
            street: {
              '@id': 'mscr:root/Root/address/Address/street',
              title: 'street',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            city: {
              '@id': 'mscr:root/Root/address/Address/city',
              title: 'city',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:55174186-1048-4ad3-9438-a04bd27919a3#root/Root/address/Address/city/City',
                properties: {
                  population: {
                    '@id':
                      'mscr:root/Root/address/Address/city/City/population',
                    title: 'population',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'array',
                    items: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
            house_number: {
              '@id': 'mscr:root/Root/address/Address/house_number',
              title: 'house_number',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

const importedSchemaExample2 = {
  metadata: {
    created: null,
    modified: null,
    modifier: null,
    creator: null,
    type: null,
    prefix: null,
    status: null,
    label: {
      en: 'string2',
    },
    description: {
      en: 'string',
    },
    languages: [],
    organizations: [],
    groups: [],
    internalNamespaces: [],
    externalNamespaces: [],
    terminologies: [],
    codeLists: [],
    contact: null,
    documentation: {},
    state: 'DRAFT',
    visibility: 'PRIVATE',
    format: 'JSONSCHEMA',
    namespace: 'http://test.com',
    versionLabel: '1',
    revisionOf: null,
    aggregationKey: 'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00',
    hasRevisions: null,
    revisions: null,
    variants: null,
    variants2: null,
    owner: ['7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'],
    fileMetadata: [],
    pid: 'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00',
  },
  content: {
    description: 'string',
    '@id': 'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#',
    title: 'string2',
    modified: 'Fri, 10 Nov 2023 12:13:51 EET',
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      aktiviteetti: {
        '@id': 'mscr:root/Root/aktiviteetti',
        title: 'Aktiviteetit',
        description:
          'Organisaation raportoimat tutkimusaktiviteetit ja palkinnot.',
        '@type': '@id',
        type: 'array',
        items: {
          type: 'object',
          '@id':
            'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti',
          properties: {
            paattymispaiva: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/paattymispaiva',
              title: 'Päättymispäivä',
              description:
                'Päättymishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Pelkkä päivä ja vuosi ei toki ole mielekäs.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            paattymiskuukausi: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/paattymiskuukausi',
              title: 'Päättymiskuukausi',
              description:
                'Päättymishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            alkamispaiva: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/alkamispaiva',
              title: 'Alkamispäivä',
              description:
                'Alkamishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Toki vuoden ja päivämäärän yhdistelmä ei ole mielekäs.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            tieteenalakoodi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/tieteenalakoodi',
              title: 'Tieteenalakoodi',
              description:
                'Aktiviteettiin tai palkintoon liittyvän tutkimuksen tieteenala Tilastokeskuksen Tieteenala 2020 -luokituksen mukaisesti. Aktiviteetilla tai palkinnolla voi olla useita tieteenaloja.',
              enum: [],
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            kansainvalinenyhteistyo: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/kansainvalinenyhteistyo',
              title: 'Kansainvälinen yhteistyö',
              description:
                '1 = Aktiviteetissa on mukana henkilöitä myös muualta kuin suomalaisista organisaatioista.\n0 = Aktiviteetissa on mukana henkilöitä ainoastaan suomalaisista organisaatioista.',
              enum: [],
              '@type': 'http://www.w3.org/2001/XMLSchema#boolean',
              type: 'boolean',
            },
            konteksti: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti',
              title: 'Konteksti',
              description:
                'Aktiviteettiin liittyvä tapahtuma (esim. konferenssi, jossa esitelmä pidetään).',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti',
                properties: {
                  alkamiskuukausi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/alkamiskuukausi',
                    title: 'Alkamiskuukausi',
                    description:
                      'Alkamishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamispaiva: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/alkamispaiva',
                    title: 'Alkamispäivä',
                    description:
                      'Alkamishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Toki vuoden ja päivämäärän yhdistelmä ei ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamisvuosi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/alkamisvuosi',
                    title: 'Alkamisvuosi',
                    description:
                      'Alkamishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  nimi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/nimi',
                    title: 'Nimi',
                    description: 'Tapahtuman, esim. konferenssin nimi.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  paattymiskuukausi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/paattymiskuukausi',
                    title: 'Päättymiskuukausi',
                    description:
                      'Päättymishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paattymispaiva: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/paattymispaiva',
                    title: 'Päättymispäivä',
                    description:
                      'Päättymishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Pelkkä päivä ja vuosi ei toki ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tapahtumanpaikka: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/tapahtumanpaikka',
                    title: 'Tapahtuman paikka',
                    description:
                      'Tapahtuman maantietellinen sijainti, esim  Boston, Massachusetts, USA.\nVoidaan käyttää myös virtuaalitapahtumiin.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  yksilointitunnus: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/yksilointitunnus',
                    title: 'Yksilöintitunnus',
                    description: 'Yksilöivä tunniste',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  maakoodi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/maakoodi',
                    title: 'Maakoodi',
                    description:
                      'Tapahtuman maantieteellisen sijainnin maakoodi.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  paattymisvuosi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/konteksti/Konteksti/paattymisvuosi',
                    title: 'Päättymisvuosi',
                    description:
                      'Päättymishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                },
                required: ['nimi'],
              },
            },
            julkaisukanava: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava',
              title: 'Julkaisukanava',
              description:
                'Aktiviteettiin liittyvä julkaisukanava (esim. lehti, johon toimitustyö liittyy).',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava',
                properties: {
                  nimi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/nimi',
                    title: 'Nimi',
                    description:
                      'Julkaisukanavan, eli lehden, sarjan, kustantajan tai konferenssin nimi',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  julkaisupaikka: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/julkaisupaikka',
                    title: 'Julkaisupaikka',
                    description:
                      'Julkaisun kustantajan nimen yhteydessä ilmoitettu paikkakunta tai paikkakunnat, ulkomailla tai Suomessa. Saattaa sisältää myös maatiedon.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  kustantaja: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/kustantaja',
                    title: 'Organisaatio',
                    description:
                      'Organisaatio, johon tutkijan koulutus, julkaisukanava, aktiviteetti tai rooli tutkimustuotoksessa liittyy.',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/kustantaja/Kustantaja',
                      properties: {
                        nimi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/kustantaja/Kustantaja/nimi',
                          title: 'Nimi',
                          description: 'Organisaation nimi',
                          '@type':
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                          maxItems: 3,
                          type: 'array',
                          items: {
                            type: 'object',
                            title: 'Multilingual string',
                            description: 'Object type for localized strings',
                            additionalProperties: {
                              type: 'string',
                            },
                          },
                        },
                        yksilointitunnus: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/kustantaja/Kustantaja/yksilointitunnus',
                          title: 'Yksilöintitunnus',
                          description: 'Yksilöivä tunniste',
                          '@type': '@id',
                          type: 'array',
                          items: {
                            type: 'object',
                            '@id':
                              'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                            properties: {
                              pysyvatunniste: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                                title: 'Pysyvä tunniste',
                                description:
                                  'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                              pysyvantunnisteentyyppi: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                                title: 'Pysyvän tunnisteen tyyppi',
                                description:
                                  'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                                enum: [],
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  jufotunnus: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/jufotunnus',
                    title: 'Jufotunnus',
                    description:
                      'Julkaisukanavan tunniste Julkaisufoorumissa (JUFO-ID).',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  yksilointitunnus: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/julkaisukanava/Julkaisukanava/yksilointitunnus',
                    title: 'Yksilöintitunnus',
                    description: 'Yksilöivä tunniste, julkaisukanavalle ISSN',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                },
                required: ['nimi'],
              },
            },
            rahoituspaatos: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/rahoituspaatos',
              title: 'Rahoittaneen rahoituspäätöksen tunniste',
              description: 'Aktiviteettia rahoittanut rahoituspäätös',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/rahoituspaatos/Rahoituspaatos',
                properties: {
                  pysyvatunniste: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/rahoituspaatos/Rahoituspaatos/pysyvatunniste',
                    title: 'Pysyvä tunniste',
                    description:
                      'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  pysyvantunnisteentyyppi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/rahoituspaatos/Rahoituspaatos/pysyvantunnisteentyyppi',
                    title: 'Pysyvän tunnisteen tyyppi',
                    description:
                      'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                },
              },
            },
            kohdeorganisaatio: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio',
              title: 'Kohdeorganisaatio',
              description:
                'Organisaatio, jossa aktiviteetti suoritetaan (esim. vierailun kohdeorganisaatio tai palkinnon myöntävä organisaatio).',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio',
                properties: {
                  yksilointitunnus: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus',
                    title: 'Yksilöintitunnus',
                    description: 'Yksilöivä tunniste',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  nimi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/nimi',
                    title: 'Nimi',
                    description: 'Organisaation nimi',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            paikallinentunnus: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/paikallinentunnus',
              title: 'Paikallinen tunnus',
              description:
                'Aktiviteetin tai palkinnon paikallinen tunniste raportoivassa organisaatiossa.  Tunniste tarvitaan, mikäli aktiviteetin tai palkinnon tietoja korjataan tai poistetaan jälkeenpäin.',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'string',
            },
            yksilointitunnus: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/yksilointitunnus',
              title: 'Yksilöintitunnus',
              description: 'Yksilöivä tunniste',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                properties: {
                  pysyvatunniste: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                    title: 'Pysyvä tunniste',
                    description:
                      'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  pysyvantunnisteentyyppi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                    title: 'Pysyvän tunnisteen tyyppi',
                    description:
                      'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                },
              },
            },
            alkamisvuosi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/alkamisvuosi',
              title: 'Alkamisvuosi',
              description:
                'Alkamishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            roolitettutekija: {
              '@id':
                'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija',
              title: 'Roolitettu tekijä',
              description:
                'Aktiviteettiin tai palkintoon nimetyllä roolilla osallistuva henkilö (tekijä/saaja).',
              '@type': '@id',
              minItems: 1,
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija',
                properties: {
                  kuvaus: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/kuvaus',
                    title: 'Rooli tutkimustuotoksessa',
                    description:
                      'Tutkijan tietojen siirtoprofiilissa rooli tutkimustuotoksessa kuvaa tutkijan roolia aktiviteetissa tai palkinnossa. Rooli ilmoitetaan aktiviteettien ja palkintojen tyypit ja roolit -koodiston mukaisesti.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  tekijantunniste: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijantunniste',
                    title: 'Tekijän tunniste',
                    description:
                      'Tutkimusaktiviteetin tekemiseen/suorittamiseen osallistuneet tutkijat tai muut henkilöt',
                    '@type': '@id',
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijantunniste/Tekijantunniste',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijantunniste/Tekijantunniste/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijantunniste/Tekijantunniste/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  sukunimituotoksessa: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/sukunimituotoksessa',
                    title: 'Sukunimi tuotoksessa',
                    description:
                      'Sukunimi aktiviteetissa tai palkinnossa. Nimi on tässä aktiviteetin tai palkinnon metatieto. Se voi siis olla eri kuin tutkijan nykyinen nimi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  tekijanaffiliaatiotuotoksenkontekstissa: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijanaffiliaatiotuotoksenkontekstissa',
                    title: 'Tekijän affiliaatio tuotoksen kontekstissa',
                    description:
                      'Tekijälle on tuotoksessa ilmoitettu yksi tai useampi affiliaatio. Tuotoksen kontekstissa annettua affiliaatiota ei voida varmuudella päätellä tutkijan tuotoksenaikaisista affiliaatioista.',
                    '@type': '@id',
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijanaffiliaatiotuotoksenkontekstissa/Tekijanaffiliaatiotuotoksenkontekstissa',
                      properties: {
                        yksilointitunnus: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijanaffiliaatiotuotoksenkontekstissa/Tekijanaffiliaatiotuotoksenkontekstissa/yksilointitunnus',
                          title: 'Yksilöintitunnus',
                          description: 'Yksilöivä tunniste',
                          '@type': '@id',
                          type: 'array',
                          items: {
                            type: 'object',
                            '@id':
                              'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                            properties: {
                              pysyvatunniste: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                                title: 'Pysyvä tunniste',
                                description:
                                  'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                              pysyvantunnisteentyyppi: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                                title: 'Pysyvän tunnisteen tyyppi',
                                description:
                                  'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                                enum: [],
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                            },
                          },
                        },
                        nimi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/tekijanaffiliaatiotuotoksenkontekstissa/Tekijanaffiliaatiotuotoksenkontekstissa/nimi',
                          title: 'Nimi',
                          description: 'Organisaation nimi',
                          '@type':
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                          maxItems: 3,
                          type: 'array',
                          items: {
                            type: 'object',
                            title: 'Multilingual string',
                            description: 'Object type for localized strings',
                            additionalProperties: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                  muunimituotoksessa: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/muunimituotoksessa',
                    title: 'Muu nimi tuotoksessa',
                    description:
                      'Muu nimi aktiviteetissa tai palkinnossa. Nimi on tässä aktiviteetin tai palkinnon metatieto. Se voi siis olla eri kuin tutkijan nykyinen nimi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  etunimettuotoksessa: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/etunimettuotoksessa',
                    title: 'Etunimet tuotoksessa',
                    description:
                      'Etunimi aktiviteetissa tai palkinnossa. Nimi on tässä aktiviteetin tai palkinnon metatieto. Se voi siis olla eri kuin tutkijan nykyinen nimi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  roolikoodi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/roolitettutekija/Roolitettutekija/roolikoodi',
                    title: 'Roolikoodi',
                    description:
                      'Aktiviteettien ja palkintojen tyypit ja roolit -koodiston mukainen arvo.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                },
                required: [
                  'tekijantunniste',
                  'tekijanaffiliaatiotuotoksenkontekstissa',
                ],
              },
            },
            avainsanat: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/avainsanat',
              title: 'Avainsanat',
              description: 'Aktiviteettia kuvaavat avainsanat',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/avainsanat/Avainsanat',
                properties: {
                  nimiavaruus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/nimiavaruus',
                    title: 'Nimiavaruus',
                    description:
                      'Sanasto, tai ontologia jossa avainsana on määritelty (voi olla myös useammassa sanastossa).',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  maaritelma: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/maaritelma',
                    title: 'Määritelmä',
                    description:
                      'käsitteen kuvaus, jonka tulee erottaa käsite sen lähikäsitteistä',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  yksilointitunnus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/yksilointitunnus',
                    title: 'Yksilöintitunnus',
                    description:
                      'Avainsanan URI tunniste (voi olla myös useammassa sanastossa).',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  kielikoodi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/kielikoodi',
                    title: 'Kielikoodi',
                    description: 'avainsanan kieli',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  avainsana: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/avainsana',
                    title: 'Avainsana',
                    description:
                      'Tutkimuksen luokkaa kuvaava avainsana. Preferenssi on, että kuvaamiseen käytetään ulkoista sanastoa/ontologiaa. Myös käsitteetöntä tietoa voidaan antaa.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
                required: ['avainsana'],
              },
            },
            maakoodi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/maakoodi',
              title: 'Maakoodi',
              description:
                'Aktiviteetin suorittamisen ensisijainen maa. Esim. vierailun kohdemaa, tapahtuman järjestämispaikan maa tai maa, josta palkinto on myönnetty.',
              enum: [],
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'string',
            },
            paattymisvuosi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/paattymisvuosi',
              title: 'Päättymisvuosi',
              description:
                'Päättymishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            alkamiskuukausi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/alkamiskuukausi',
              title: 'Alkamiskuukausi',
              description:
                'Alkamishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
              '@type': 'http://www.w3.org/2001/XMLSchema#integer',
              type: 'integer',
            },
            verkkolinkki: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/verkkolinkki',
              title: 'Verkkolinkki',
              description:
                'Esimekiksi tutkijalla, tutkimusyhteisöllä, organisaatiolla, voi olla erilaisia läsnäolon muotoja internetissä, joka on määritelty omassa luokassaan. Tämä on osoitin tuohon luokkaan.',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki',
                properties: {
                  url: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/url',
                    title: 'URL',
                    description: 'Uniform Resource Locator (URL)',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  linkintyyppi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/linkintyyppi',
                    title: 'Linkin tyyppi',
                    description:
                      'Palvelu tai osoitteen laji johon linkki viittaa. Esim Linked-In tai tutkijaprofiili affiliaation verkkosivulla. Tämä eroaa kuitenkin tunnisteesta, joten ei esim ORCID.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  kuvaus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/kuvaus',
                    title: 'Kuvaus',
                    description: 'kohteen sisällöstä kertova tieto',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            nimi: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/nimi',
              title: 'Nimi',
              description: 'Aktiviteettia tai palkintoa kuvaava nimi.',
              '@type': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
              maxItems: 3,
              minItems: 1,
              type: 'array',
              items: {
                type: 'object',
                title: 'Multilingual string',
                description: 'Object type for localized strings',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
            kuvaus: {
              '@id': 'mscr:root/Root/aktiviteetti/Aktiviteetti/kuvaus',
              title: 'Kuvaus',
              description: 'Aktiviteetin tai palkinnon tarkempi kuvaus.',
              '@type': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
              maxItems: 3,
              type: 'array',
              items: {
                type: 'object',
                title: 'Multilingual string',
                description: 'Object type for localized strings',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          },
          required: ['nimi', 'roolitettutekija'],
        },
      },
      organisaatiorakenteenvuosi: {
        '@id': 'mscr:root/Root/organisaatiorakenteenvuosi',
        title: 'Organisaatiorakenteen vuosi',
        description:
          'Organisaatioiden rakenteet ovat jatkuvan muutoksen alaisena. Tällä kentällä kerrotaan minkävuoden mukaista organisaatiorakennetta tiedoissa käytetään.',
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        type: 'string',
      },
      raportoivanorganisaationtunniste: {
        '@id': 'mscr:root/Root/raportoivanorganisaationtunniste',
        title: 'Raportoivan organisaation tunniste',
        '@type': 'http://www.w3.org/2001/XMLSchema#string',
        type: 'string',
      },
      tutkija: {
        '@id': 'mscr:root/Root/tutkija',
        title: 'Tutkijat',
        '@type': '@id',
        type: 'array',
        items: {
          type: 'object',
          '@id':
            'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija',
          properties: {
            tutkijankuvaus: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/tutkijankuvaus',
              title: 'Tutkijan kuvaus',
              description:
                'Vapaamuotoinen kuvaus tutkijan relevanteista kyvykkyyksistä.',
              '@type': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
              maxItems: 3,
              type: 'array',
              items: {
                type: 'object',
                title: 'Multilingual string',
                description: 'Object type for localized strings',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
            member_of: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/member_of',
              title: 'Jäsenyys',
              '@type': '@id',
              minItems: 0,
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/member_of/Member_of',
                properties: {
                  affiliaation_tyyppi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/affiliaation_tyyppi',
                    title: 'Affiliaation tyyppi',
                    description:
                      'Henkilön suhde organisaatioon (esim. työsuhde, dosentuuri, vieraileva tutkija).',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  tehtavanimike: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tehtavanimike',
                    title: 'Tehtävänimike',
                    description:
                      'Henkilön nimike tyypillisimmin työsuhteessa organisaatioon (esim. professori, yliopistonlehtori, tuntiopettaja). Tämä on erityisesti niille toimijoille, joilla nimikkeet eivät perustu yliopistojen tehtävänimikekoodistoon. Mikäli kentässä Tehtäväkoodi on arvo, tämä kenttä voi olla tyhjä.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  paattymisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/paattymisvuosi',
                    title: 'Päättymisvuosi',
                    description:
                      'Päättymishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paattymispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/paattymispaiva',
                    title: 'Päättymispäivä',
                    description:
                      'Päättymishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Pelkkä päivä ja vuosi ei toki ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paikallinentunnus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/paikallinentunnus',
                    title: 'Paikallinen tunnus',
                    description:
                      'Raportoivan organisaation oma paikallinen tunniste tutkijan affiliaatiolle. Tunniste tarvitaan, mikäli tietoja mahdollisesti korjataan tai poistetaan jälkeenpäin.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  alkamisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/alkamisvuosi',
                    title: 'Alkamisvuosi',
                    description:
                      'Alkamishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paattymiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/paattymiskuukausi',
                    title: 'Päättymiskuukausi',
                    description:
                      'Päättymishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/alkamispaiva',
                    title: 'Alkamispäivä',
                    description:
                      'Alkamishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Toki vuoden ja päivämäärän yhdistelmä ei ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tehtavakoodi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tehtavakoodi',
                    title: 'Tehtäväkoodi',
                    description:
                      'Koodiston määrittelemä koodi/tunniste tehtävänimikkeelle.  Käytetty koodisto pätee vain korkeakouluille.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  tutkijan_affiliaatio: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio',
                    title: 'Alayksikkö',
                    description:
                      'Alayksikkö, johon tutkija on affilioitunut. Alayksikön tulee olla OKM:lle raportoidussa alayksikkökoodistossa .',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio',
                      properties: {
                        nimi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio/nimi',
                          title: 'Nimi',
                          description: 'Alayksikön nimi',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        alayksikkokoodi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio/alayksikkokoodi',
                          title: 'Alayksikkökoodi',
                          description:
                            'Alayksikön koodi OKM:lle raportoidussa alayksikkökoodistossa.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  alkamiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/alkamiskuukausi',
                    title: 'Alkamiskuukausi',
                    description:
                      'Alkamishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                },
              },
            },
            sukunimi: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/sukunimi',
              title: 'Sukunimi',
              description:
                'pääasiallisesti sukuun viittaava rekisteröidyn henkilönnimen osa',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'string',
            },
            vaihtoehtoinennimi: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/vaihtoehtoinennimi',
              title: 'Vaihtoehtoinen nimi',
              description:
                'nimi, jolla henkilö tai oikeushenkilö tunnetaan ja joka ei ole henkilön tai oikeushenkilön rekisteröity nimi',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            paikallinentunnus: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/paikallinentunnus',
              title: 'Paikallinen tunnus',
              description:
                'Ei-globaali tai standardoitu tunniste, vaan jonkin lähdejärjestelmän paikkallinen tunniste.',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'string',
            },
            yksilointitunnus: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/yksilointitunnus',
              title: 'Yksilöintitunnus',
              description:
                'Tutkimuksen piirissä toimivan henkilön yksilöivä tunniste, tyypillisimmin ORCID, esim julkaisun/teoksen yhteydessä ISNI',
              '@type': '@id',
              minItems: 1,
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                properties: {
                  pysyvatunniste: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                    title: 'Pysyvä tunniste',
                    description:
                      'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  pysyvantunnisteentyyppi: {
                    '@id':
                      'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                    title: 'Pysyvän tunnisteen tyyppi',
                    description:
                      'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                },
              },
            },
            suorittanutkoulutuksen: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen',
              title: 'Suorittanut koulutuksen',
              '@type': '@id',
              minItems: 0,
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen',
                properties: {
                  paattymisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/paattymisvuosi',
                    title: 'Päättymisvuosi',
                    description:
                      'Päättymishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tutkintonimikekoodi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/tutkintonimikekoodi',
                    title: 'Tutkintonimikekoodi',
                    description:
                      'Tilastokeskuksen koulutusluokituksen 2019 mukainen koodi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  patevyys: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/patevyys',
                    title: 'Pätevyys',
                    description:
                      'Koulutuksen suoritettamisesta saatava pätevyys',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/patevyys/Patevyys',
                      properties: {
                        koodi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/patevyys/Patevyys/koodi',
                          title: 'Koodi',
                          description: 'Ei raportoida, sillä koodistoa ei ole.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        kuvaus: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/patevyys/Patevyys/kuvaus',
                          title: 'Kuvaus',
                          description: 'kohteen sisällöstä kertova tieto',
                          '@type':
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                          maxItems: 3,
                          type: 'array',
                          items: {
                            type: 'object',
                            title: 'Multilingual string',
                            description: 'Object type for localized strings',
                            additionalProperties: {
                              type: 'string',
                            },
                          },
                        },
                        nimi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/patevyys/Patevyys/nimi',
                          title: 'Nimi',
                          description: 'Pätevyyden nimi',
                          '@type':
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                          maxItems: 3,
                          type: 'array',
                          items: {
                            type: 'object',
                            title: 'Multilingual string',
                            description: 'Object type for localized strings',
                            additionalProperties: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                  paikallinentunnus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/paikallinentunnus',
                    title: 'Paikallinen tunnus',
                    description:
                      'Raportoivan organisaation oma paikallinen tunniste tutkijan koulutukselle. Tunniste tarvitaan, mikäli tietoja mahdollisesti korjataan tai poistetaan jälkeenpäin.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  koulutuksenjarjestaja: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/koulutuksenjarjestaja',
                    title: 'Koulutuksen järjestäjä',
                    description:
                      'Tutkijan omaaman koulutuksen järjestänyt taho (organisaatio). Kyseinen koulutus saattaa johtaa muodolliseen pätevyyteen tai tutkintoon, muttei välttämättä.',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/koulutuksenjarjestaja/Koulutuksenjarjestaja',
                      properties: {
                        nimi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/koulutuksenjarjestaja/Koulutuksenjarjestaja/nimi',
                          title: 'Nimi',
                          description: 'Organisaation nimi',
                          '@type':
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                          maxItems: 3,
                          type: 'array',
                          items: {
                            type: 'object',
                            title: 'Multilingual string',
                            description: 'Object type for localized strings',
                            additionalProperties: {
                              type: 'string',
                            },
                          },
                        },
                        yksilointitunnus: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/koulutuksenjarjestaja/Koulutuksenjarjestaja/yksilointitunnus',
                          title: 'Yksilöintitunnus',
                          description: 'Yksilöivä tunniste',
                          '@type': '@id',
                          type: 'array',
                          items: {
                            type: 'object',
                            '@id':
                              'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                            properties: {
                              pysyvatunniste: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                                title: 'Pysyvä tunniste',
                                description:
                                  'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                              pysyvantunnisteentyyppi: {
                                '@id':
                                  'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                                title: 'Pysyvän tunnisteen tyyppi',
                                description:
                                  'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                                enum: [],
                                '@type':
                                  'http://www.w3.org/2001/XMLSchema#string',
                                type: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  paattymispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/paattymispaiva',
                    title: 'Päättymispäivä',
                    description:
                      'Päättymishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Pelkkä päivä ja vuosi ei toki ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tunnus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/tunnus',
                    title: 'Tunniste',
                    description:
                      'Ei käytössä, sillä ei-tutkintoon johtaville koulutuksille ei ole löydetty soveliasta koodistoa. \nTutkintoon johtavat koulutukset annetaan kohdassa tutkintonimikekoodi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  paattymiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/paattymiskuukausi',
                    title: 'Päättymiskuukausi',
                    description:
                      'Päättymishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/alkamisvuosi',
                    title: 'Alkamisvuosi',
                    description:
                      'Alkamishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.\n\nKoulutukselle tulisi antaa minimissään joko alkamis- tai päättymisvuosi.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/alkamiskuukausi',
                    title: 'Alkamiskuukausi',
                    description:
                      'Alkamishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/alkamispaiva',
                    title: 'Alkamispäivä',
                    description:
                      'Alkamishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Toki vuoden ja päivämäärän yhdistelmä ei ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  kuvaus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/kuvaus',
                    title: 'Koulutuksen kuvaus',
                    description: 'Koulutuksen laajempi kuvaus',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  laajuus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/laajuus',
                    title: 'Laajuus',
                    description: 'Laajuus osaamispisteinä',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tutkintonimike_nimi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/tutkintonimike_nimi',
                    title: 'Tutkintonimike',
                    description:
                      'Nimike, jota henkilö voi käyttää suoritettuaan sen käyttöön oikeuttavan tutkinnon. Tämän attribuutin päätehtävä on tarjota mahdollisuus antaa nimiketieto silloin, kun vastaavaa koodistoarvoa ei ole, tai se ei ole tiedossa (esim ulkomaiset tutkinnot).',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  opetuskieli: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/opetuskieli',
                    title: 'Opetuskieli',
                    description:
                      'Kieli, jolla koulutukseen liittyvä opetus on annettu.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  nimi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/suorittanutkoulutuksen/Suorittanutkoulutuksen/nimi',
                    title: 'Nimi',
                    description: 'Koulutuksen nimi, esim. tutkinnon nimi.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
                required: ['nimi'],
              },
            },
            verkkolinkki: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/verkkolinkki',
              title: 'Verkkolinkki',
              description:
                'Has a webpresence at a given service/url, e.g. an organisational www-page, twitter, linked-in, facebook, etc',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki',
                properties: {
                  url: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/url',
                    title: 'URL',
                    description: 'Uniform Resource Locator (URL)',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  linkintyyppi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/linkintyyppi',
                    title: 'Linkin tyyppi',
                    description:
                      'Palvelu tai osoitteen laji johon linkki viittaa. Esim Linked-In tai tutkijaprofiili affiliaation verkkosivulla. Tämä eroaa kuitenkin tunnisteesta, joten ei esim ORCID.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  kuvaus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/verkkolinkki/Verkkolinkki/kuvaus',
                    title: 'Kuvaus',
                    description: 'kohteen sisällöstä kertova tieto',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            yhteystieto: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/yhteystieto',
              title: 'Yhteystiedot',
              description: 'Toimijan yhteystiedot',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/yhteystieto/Yhteystieto',
                properties: {
                  puhelinnumero: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/yhteystieto/Yhteystieto/puhelinnumero',
                    title: 'Puhelinnumero',
                    description: 'puhelinnumeron määritelmä',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  sahkopostiosoite: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/yhteystieto/Yhteystieto/sahkopostiosoite',
                    title: 'Sähköpostiosoite',
                    description:
                      'tunnus, jonka mukaan sähköpostiviesti ohjautuu tietoverkossa oikealle vastaanottajalle',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                },
              },
            },
            avainsanat: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/avainsanat',
              title: 'Avainsanat',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/avainsanat/Avainsanat',
                properties: {
                  nimiavaruus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/nimiavaruus',
                    title: 'Nimiavaruus',
                    description:
                      'Sanasto, tai ontologia jossa avainsana on määritelty (voi olla myös useammassa sanastossa).',
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  maaritelma: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/maaritelma',
                    title: 'Määritelmä',
                    description:
                      'käsitteen kuvaus, jonka tulee erottaa käsite sen lähikäsitteistä',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  yksilointitunnus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/yksilointitunnus',
                    title: 'Yksilöintitunnus',
                    description:
                      'Avainsanan URI tunniste (voi olla myös useammassa sanastossa).',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus',
                      properties: {
                        pysyvatunniste: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvatunniste',
                          title: 'Pysyvä tunniste',
                          description:
                            'Kohteen yksilöivä ainutkertainen merkkijono, jonka avulla kohteeseen voidaan yksiselitteisesti viitata. \n\n- Tutkijalla tai aktiviteetin tekijällä ORCID.\n- Julkaisukanavalla ISSN tai ISBN.\n- Organisaatiolla esim. Y-tunnus tai ISNI.\n- Avainsanalla URI.\nTapahtumilla ei toistaiseksi ole käytössä vakiintunieta tunnisteita.',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                        pysyvantunnisteentyyppi: {
                          '@id':
                            'mscr:root/Root/aktiviteetti/Aktiviteetti/kohdeorganisaatio/Kohdeorganisaatio/yksilointitunnus/Yksilointitunnus/pysyvantunnisteentyyppi',
                          title: 'Pysyvän tunnisteen tyyppi',
                          description:
                            'Pysyvän tunnisteen tyyppi  Tutkimusaineistojen pysyvät tunnisteet -koodiston mukaisesti.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  kielikoodi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/kielikoodi',
                    title: 'Kielikoodi',
                    description: 'avainsanan kieli',
                    enum: [],
                    '@type': 'http://www.w3.org/2001/XMLSchema#string',
                    type: 'string',
                  },
                  avainsana: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/avainsanat/Avainsanat/avainsana',
                    title: 'Avainsana',
                    description:
                      'Tutkimuksen luokkaa kuvaava avainsana. Preferenssi on, että kuvaamiseen käytetään ulkoista sanastoa/ontologiaa. Myös käsitteetöntä tietoa voidaan antaa.',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    minItems: 1,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                },
                required: ['avainsana'],
              },
            },
            jasenyystutkimusyhteisossa: {
              '@id':
                'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa',
              title: 'Jäsenyys tutkimusyhteisössä',
              '@type': '@id',
              type: 'array',
              items: {
                type: 'object',
                '@id':
                  'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa',
                properties: {
                  alkamispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/alkamispaiva',
                    title: 'Alkamispäivä',
                    description:
                      'Alkamishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Toki vuoden ja päivämäärän yhdistelmä ei ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  kuvaus: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/kuvaus',
                    title: 'Kuvaus',
                    description:
                      'Kuvaus tutkijan roolista tutkimusyhteisössä (esim. johtaja, tutkija, tohtorikoulutettava).',
                    '@type':
                      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
                    maxItems: 3,
                    type: 'array',
                    items: {
                      type: 'object',
                      title: 'Multilingual string',
                      description: 'Object type for localized strings',
                      additionalProperties: {
                        type: 'string',
                      },
                    },
                  },
                  paattymispaiva: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/paattymispaiva',
                    title: 'Päättymispäivä',
                    description:
                      'Päättymishetki päivän tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole. Pelkkä päivä ja vuosi ei toki ole mielekäs.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  alkamiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/alkamiskuukausi',
                    title: 'Alkamiskuukausi',
                    description:
                      'Alkamishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paattymisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/paattymisvuosi',
                    title: 'Päättymisvuosi',
                    description:
                      'Päättymishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  paattymiskuukausi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/paattymiskuukausi',
                    title: 'Päättymiskuukausi',
                    description:
                      'Päättymishetki kuukauden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella, jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                  tutkijan_affiliaatio: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/tutkijan_affiliaatio',
                    title: 'Tutkimusyhteisö',
                    description:
                      'Tutkimusyhteisö ei ole tarkkaan määritelty käsite. Se on osittain päällekkäinen tutkimusryhmän kanssa. Tutkimusyhteisö voi olla poikkitieteellinen laitos-, tiedekuntarajat ylittävä tai jopa korkeakoulujen välinen tiettyyn teemaan tai tematiikkaan keskittyvä joukko tutkijoita, jota tuntevat jaetun kiinnostuksen kohteen kautta yhteenkuuluvuutta. Yhteisöön liitytään tehtävän tutkimuksen tematiikan kautta - sen mukaan mistä parhaiten vertaistukea ja yhteistyökumppaneita löytyy. Tutkijat voivat kuulua moniin eri yhteisöihin samanaikaisesti. Tutkimusyhteisöt eivät näin noudata hallinnollisten yksiköiden rajoja. Tutkijan kuuluminen tiettyyn tutkimusyhteisöön on tyypillisesti pysyväisluonteisempaa kuin tiettyyn organisatoriseen yksikköön kuuluminen.',
                    '@type': '@id',
                    type: 'array',
                    items: {
                      type: 'object',
                      '@id':
                        'urn:IAMNOTAPID:4b28461f-396d-485a-8cac-31ca6d091c00#root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio',
                      properties: {
                        nimi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio/nimi',
                          title: 'Nimi',
                          description: 'Alayksikön nimi',
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        alayksikkokoodi: {
                          '@id':
                            'mscr:root/Root/tutkija/Tutkija/member_of/Member_of/tutkijan_affiliaatio/Tutkijan_affiliaatio/alayksikkokoodi',
                          title: 'Alayksikkökoodi',
                          description:
                            'Alayksikön koodi OKM:lle raportoidussa alayksikkökoodistossa.',
                          enum: [],
                          '@type': 'http://www.w3.org/2001/XMLSchema#string',
                          type: 'string',
                        },
                      },
                    },
                  },
                  alkamisvuosi: {
                    '@id':
                      'mscr:root/Root/tutkija/Tutkija/jasenyystutkimusyhteisossa/Jasenyystutkimusyhteisossa/alkamisvuosi',
                    title: 'Alkamisvuosi',
                    description:
                      'Alkamishetki vuoden tarkkuudella määriteltynä. Periaatteessa ajanhetki pilkottuna kolmeen osaan mahdollistaen ilmaisun sillä tarkkuudella jolla tietoa on saatavilla (esim vuosi+kk). Tällä voidaan ennalta ehkäistä se, että joudutaan feikkaamaan tietoa, silloin kun sitä ei ole.',
                    '@type': 'http://www.w3.org/2001/XMLSchema#integer',
                    type: 'integer',
                  },
                },
              },
            },
            etunimet: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/etunimet',
              title: 'Etunimet',
              description: 'henkilön kaikki etunimet lueteltuna',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              type: 'string',
            },
            kokonimi: {
              '@id': 'mscr:root/Root/tutkija/Tutkija/kokonimi',
              title: 'Nimi',
              description: 'henkilön täydellinen nimi',
              '@type': 'http://www.w3.org/2001/XMLSchema#string',
              minItems: 1,
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          required: ['yksilointitunnus', 'kokonimi'],
        },
      },
    },
  },
};

export default function MockupSchemaLoader(
  emptyTemplate: boolean
): Promise<RenderTree[] | undefined> {
  const hugeTestData: any = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {
      null: {
        title: null,
        description: null,
      },
      acoustic_area_backscattering_strength_in_sea_water: {
        title: 'acoustic_area_backscattering_strength_in_sea_water',
        description:
          'Acoustic area backscattering strength is 10 times the log10 of the ratio of the area backscattering coefficient to the reference value, 1 (m2 m-2). Area backscattering coefficient is the integral of the volume backscattering coefficient over a defined distance. Volume backscattering coefficient is the linear form of acoustic_volume_backscattering_strength_in_sea_water. For further details see MacLennan et. al (2002) doi:10.1006/jmsc.2001.1158.',
      },
      acoustic_signal_roundtrip_travel_time_in_sea_water: {
        title: 'acoustic_signal_roundtrip_travel_time_in_sea_water',
        description:
          'The quantity with standard name acoustic_signal_roundtrip_travel_time_in_sea_water is the time taken for an acoustic signal to propagate from the emitting instrument to a reflecting surface and back again to the instrument. In the case of an instrument based on the sea floor and measuring the roundtrip time to the sea surface, the data are commonly used as a measure of ocean heat content.',
      },
      acoustic_target_strength_in_sea_water: {
        title: 'acoustic_target_strength_in_sea_water',
        description:
          'Target strength is 10 times the log10 of the ratio of backscattering cross-section to the reference value, 1 m2. Backscattering cross-section is a parameter computed from the intensity of the backscattered sound wave relative to the intensity of the incident sound wave. For further details see MacLennan et. al (2002) doi:10.1006/jmsc.2001.1158.',
      },
      acoustic_volume_backscattering_strength_in_sea_water: {
        title: 'acoustic_volume_backscattering_strength_in_sea_water',
        description:
          'Acoustic volume backscattering strength is 10 times the log10 of the ratio of the volume backscattering coefficient to the reference value, 1 m-1. Volume backscattering coefficient is the integral of the backscattering cross-section divided by the volume sampled. Backscattering cross-section is a parameter computed from the intensity of the backscattered sound wave relative to the intensity of the incident sound wave. The parameter is computed to provide a measurement that is proportional to biomass density per unit volume in the field of fisheries acoustics. For further details see MacLennan et. al (2002) doi:10.1006/jmsc.2001.1158.',
      },
    },
  };

  const testData: any = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      $schema: {
        type: 'string',
      },
      string_type: {
        type: 'string',
        description: '01_string_description',
      },
      number_type: {
        type: 'number',
        minimum: 3,
        exclusiveMinimum: false,
      },
      integer_type: {
        type: 'integer',
        minimum: 2,
      },
      boolean_type: {
        type: 'boolean',
      },
      null_type: {
        type: 'null',
      },
      object_type: {
        title: 'OBJECT TYPE',
        type: 'object',
        properties: {
          string_property: {
            title: 'string_prop',
            type: 'string',
          },
        },
        required: ['string_property'],
      },
      array_string_type: {
        type: 'array',
        maxItems: 5,
        items: {
          type: 'string',
        },
      },
      object_arrays_type: {
        type: 'object',
        properties: {
          array_property: {
            title: 'array_prop',
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    },
    additionalProperties: false,
    b2share: {
      presentation: {
        major: [
          'community',
          'titles',
          'descriptions',
          'creators',
          'open_access',
          'embargo_date',
          'license',
          'disciplines',
          'keywords',
          'contact_email',
        ],
        minor: [
          'contributors',
          'resource_types',
          'alternate_identifiers',
          'version',
          'publisher',
          'language',
        ],
      },
    },
  };

  const testSchema: any = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      $schema: {
        type: 'string',
      },
      creators: {
        title: 'Creators',
        description:
          'The full name of the creators. The personal name format should be: family, given (e.g.: Smith, John).',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            creator_name: {
              type: 'string',
            },
          },
          additionalProperties: false,
          required: ['creator_name'],
        },
        uniqueItems: true,
      },
      titles: {
        title: 'Titles',
        description:
          'The title(s) of the uploaded resource, or a name by which the resource is known.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
          },
          additionalProperties: false,
          required: ['title'],
        },
        minItems: 1,
        uniqueItems: true,
      },
      publisher: {
        title: 'Publisher',
        description:
          'The entity responsible for making the resource available, either a person, an organization, or a service.',
        type: 'string',
      },
      publication_date: {
        title: 'Publication Date',
        description:
          'The date when the data was or will be made publicly available (e.g. 1971-07-13)',
        type: 'string',
        format: 'date',
      },
      disciplines: {
        title: 'Disciplines',
        description: 'The scientific disciplines linked with the resource.',
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
      keywords: {
        title: 'Keywords',
        description:
          'A list of keywords or key phrases describing the resource.',
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
      contributors: {
        title: 'Contributors',
        description:
          'The list of all other contributors. Please mention all persons that were relevant in the creation of the resource.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            contributor_name: {
              title: 'Name',
              type: 'string',
            },
            contributor_type: {
              title: 'Type',
              enum: [
                'ContactPerson',
                'DataCollector',
                'DataCurator',
                'DataManager',
                'Distributor',
                'Editor',
                'HostingInstitution',
                'Producer',
                'ProjectLeader',
                'ProjectManager',
                'ProjectMember',
                'RegistrationAgency',
                'RegistrationAuthority',
                'RelatedPerson',
                'Researcher',
                'ResearchGroup',
                'RightsHolder',
                'Sponsor',
                'Supervisor',
                'WorkPackageLeader',
                'Other',
              ],
            },
          },
          additionalProperties: false,
          required: ['contributor_name', 'contributor_type'],
        },
        uniqueItems: true,
      },
      language: {
        title: 'Language',
        description:
          'The primary language of the resource. Please use ISO_639-3 language codes.',
        type: 'string',
      },
      resource_types: {
        title: 'Resource Type',
        description: 'The type(s) of the resource.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resource_type: {
              title: 'Description',
              type: 'string',
            },
            resource_type_general: {
              title: 'Category',
              enum: [
                'Audiovisual',
                'Collection',
                'Dataset',
                'Event',
                'Image',
                'InteractiveResource',
                'Model',
                'PhysicalObject',
                'Service',
                'Software',
                'Sound',
                'Text',
                'Workflow',
                'Other',
              ],
            },
          },
          additionalProperties: false,
          required: ['resource_type_general'],
        },
        minItems: 1,
        uniqueItems: true,
      },
      alternate_identifiers: {
        title: 'Alternate identifiers',
        description:
          'Any kind of other reference such as a URN, URI or an ISBN number.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            alternate_identifier: {
              type: 'string',
            },
            alternate_identifier_type: {
              title: 'Type',
              type: 'string',
            },
          },
          additionalProperties: false,
          required: ['alternate_identifier', 'alternate_identifier_type'],
        },
        uniqueItems: true,
      },
      descriptions: {
        title: 'Descriptions',
        description:
          'A more elaborate description of the resource. Focus on a content description that makes it easy for others to find, and to interpret its relevance.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            description_type: {
              title: 'Type',
              enum: [
                'Abstract',
                'Methods',
                'SeriesInformation',
                'TableOfContents',
                'TechnicalInfo',
                'Other',
              ],
            },
          },
          additionalProperties: false,
          required: ['description', 'description_type'],
        },
        uniqueItems: true,
      },
      version: {
        title: 'Version',
        description: 'Denote the version of the resource.',
        type: 'string',
      },
      contact_email: {
        title: 'Contact Email',
        description: 'Contact email information for this record.',
        type: 'string',
        format: 'email',
      },
      open_access: {
        title: 'Open Access',
        description:
          "Indicate whether the record's files are publicly accessible or not. In case of restricted access the uploaded files will only be accessible by the record's owner and the community administrators. Please note that the record's metadata is always publicly accessible. ",
        type: 'boolean',
      },
      embargo_date: {
        title: 'Embargo Date',
        description:
          'The date marking the end of the embargo period. The record will be marked as open access on the specified date at midnight. Please note that the record metadata is always publicly accessible, and only the data files can have private access.',
        type: 'string',
        format: 'date-time',
      },
      license: {
        title: 'License',
        description:
          'Specify the license under which this data set is available to the users (e.g. GPL, Apache v2 or Commercial). Please use the License Selector for help and additional information.',
        type: 'object',
        properties: {
          license: {
            type: 'string',
          },
          license_uri: {
            title: 'License URL',
            type: 'string',
            format: 'uri',
          },
        },
        additionalProperties: false,
        required: ['license'],
      },
      community: {
        title: 'Community',
        description: 'The community to which the record has been submitted.',
        type: 'string',
      },
      community_specific: {
        type: 'object',
      },
      publication_state: {
        title: 'Publication State',
        description: 'State of the publication workflow.',
        type: 'string',
        enum: ['draft', 'submitted', 'published'],
      },
      _pid: {
        title: 'Persistent Identifiers',
        description: 'Array of persistent identifiers pointing to this record.',
      },
      _deposit: {
        type: 'object',
      },
      _oai: {
        type: 'object',
      },
      _files: {
        type: 'array',
      },
    },
    required: [
      'community',
      'titles',
      'open_access',
      'publication_state',
      'community_specific',
    ],
    additionalProperties: false,
    b2share: {
      presentation: {
        major: [
          'community',
          'titles',
          'descriptions',
          'creators',
          'open_access',
          'embargo_date',
          'license',
          'disciplines',
          'keywords',
          'contact_email',
        ],
        minor: [
          'contributors',
          'resource_types',
          'alternate_identifiers',
          'version',
          'publisher',
          'language',
        ],
      },
    },
  };

  let allTreeNodes: RenderTree[] = [];

  let currentTreeNode: RenderTree = {
    idNumeric: 0,
    id: '0',
    name: '',
    isLinked: false,
    title: '',
    type: '',
    description: '',
    required: '',
    isMappable: '',
    parentName: '',
    jsonPath: '$schema',
    parentId: 0,
    children: [],
  };

  let nodeId = 0;

  function increaseNodeNumber() {
    nodeId += 1;
  }

  function createTreeObject(
    object: string,
    value: string,
    parent: string,
    rootId: any,
    jsonPath: string
  ) {
    currentTreeNode.jsonPath = jsonPath + '.' + object;
    currentTreeNode.idNumeric = nodeId;
    currentTreeNode.id = nodeId.toString();
    currentTreeNode.parentId = rootId;
    currentTreeNode.name = object;
    currentTreeNode.title = value;
    currentTreeNode.parentName = parent;
    increaseNodeNumber();
  }

  function walkJson(
    json_object: any,
    parent: any,
    rootId: number,
    jsonPath: string
  ) {
    for (const obj in json_object) {
      if (typeof json_object[obj] === 'string') {
        //console.log(`leaf ${obj} = ${json_object[obj]}`);

        // OBJECT IS A LEAF LEVEL OBJECT
        currentTreeNode = {
          isLinked: false,
          idNumeric: 0,
          id: '0',
          name: '',
          title: '',
          type: 'string',
          description: '',
          required: '',
          parentId: 0,
          jsonPath,
          children: [],
        };
        createTreeObject(obj, json_object[obj], parent, rootId, jsonPath);
        allTreeNodes.push(cloneDeep(currentTreeNode));
      } else if (typeof json_object[obj] === 'boolean') {
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FOUND BOOLEAN', obj, json_object[obj], json_object);

        // OBJECT IS A LEAF LEVEL OBJECT
        currentTreeNode = {
          isLinked: false,
          idNumeric: 0,
          id: '0',
          name: '',
          title: '',
          type: json_object[obj].toString(),
          description: '',
          required: '',
          parentId: 0,
          jsonPath,
          children: [],
        };
        createTreeObject(obj, json_object[obj], parent, rootId, jsonPath);
        allTreeNodes.push(cloneDeep(currentTreeNode));
      } else {
        // OBJECT HAS CHILDREN
        currentTreeNode = {
          isLinked: false,
          idNumeric: 0,
          id: '0',
          name: '',
          title: '',
          type: Array.isArray(json_object[obj]) ? 'array' : 'composite',
          description: '',
          required: '',
          parentId: 0,
          jsonPath,
          children: [],
        };
        currentTreeNode.name = obj;
        currentTreeNode.parentName = parent;
        currentTreeNode.parentId = rootId;
        currentTreeNode.idNumeric = nodeId;
        currentTreeNode.id = nodeId.toString();

        currentTreeNode.jsonPath = jsonPath + '.' + obj;
        increaseNodeNumber();
        allTreeNodes.push(cloneDeep(currentTreeNode));
        walkJson(json_object[obj], obj, nodeId - 1, currentTreeNode.jsonPath);
      }
    }
    return allTreeNodes;
  }

  function mergeAttributesToParent(inputNodes: RenderTree[] | undefined) {
    if (inputNodes) {
      let outputNodes = inputNodes.map((parent: RenderTree) => {
        if (parent.children) {
          let i = parent.children.length;
          while (i--) {
            // @ts-ignore
            if (parent.children[i] && parent.children[i].children.length > 0) {
              mergeAttributesToParent([parent.children[i]]);
            }
            if (parent.children[i].name === 'type') {
              parent.type = parent.children[i].title;
              //parent.children.splice(i, 1);
            } else if (parent.children[i].name === 'description') {
              parent.description = parent.children[i].title;
              //parent.children.splice(i, 1);
            } else if (parent.children[i].name === 'title') {
              parent.title = parent.children[i].title;
              //parent.children.splice(i, 1);
            }
          }
        }
        return parent;
      });
      return outputNodes;
    }
  }

  function processChildNodes() {
    for (let i = allTreeNodes.length - 1; i > 0; i -= 1) {
      if (allTreeNodes[i]) {
        allTreeNodes[allTreeNodes[i].parentId].children.push(
          cloneDeep(allTreeNodes[i])
        );
      }
    }
    return { allTreeNodes };
  }

  // Recursive tree creation causes tree to build in reversed order, so tree needs to be reversed to match the node order in original JSON
  function reverseTreeRootLevel(inputNodes: RenderTree[] | undefined) {
    let retNodes: RenderTree[];
    if (inputNodes) {
      return inputNodes.reverse();
    }
  }

  // Unused
  function reverseTreeChildren(inputNodes: RenderTree[] | undefined) {
    if (inputNodes) {
      for (let i = 0; i < inputNodes.length; i += 1) {
        // @ts-ignore
        if (inputNodes[i].children.length > 1) {
          // @ts-ignore
          inputNodes[i].children = inputNodes[i].children.reverse();
          reverseTreeChildren(inputNodes[i].children);
        }
      }
      return inputNodes;
    }
  }

  walkJson(
    emptyTemplate ? importedSchemaExample : currentTreeNode,
    null,
    0,
    'ROOT'
  );
  processChildNodes();
  console.log(
    '######### NEW',
    mergeAttributesToParent(reverseTreeRootLevel(allTreeNodes))
  );

  return new Promise((resolve) => {
    resolve(reverseTreeRootLevel(allTreeNodes));
  });
}
export function getImportedSchemaMock(): Promise<any> {
  return new Promise((resolve) => {
    resolve(importedSchemaExample2);
  });
}

export function getFilterFunctions(): Promise<any> {
  return new Promise((resolve) => {
    resolve(functionsMockup);
  });
}
