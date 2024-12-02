import generateInitialData from './generate-initial-data';
import { TerminologyType } from '@app/common/interfaces/interfaces-v2';

describe('generate-initial-data', () => {
  it('should generate initial data from input', () => {
    const returned = generateInitialData('fi', {
      uri: 'https://iri.suomi.fi/terminology/test/',
      label: {
        fi: 'testi fi',
        en: 'test en',
      },
      description: {
        fi: 'kuvaus',
      },
      prefix: 'abc1234',
      graphType: TerminologyType.TERMINOLOGICAL_VOCABULARY,
      status: 'DRAFT',
      languages: ['fi', 'en'],
      contact: 'yhteentoimivuus@dvv.fi',
      groups: [
        {
          id: 'http://group-id-1',
          label: {
            fi: 'Asuminen',
          },
          identifier: 'P10',
        },
        {
          id: 'http://group-id-2',
          label: {
            fi: 'Demokratia',
          },
          identifier: 'P11',
        },
      ],
      organizations: [
        {
          id: '456-456',
          label: {
            fi: 'Yhteentoimivuusalustan yllapito',
          },
        },
      ],
      created: '',
      modified: '',
      creator: {
        id: '',
      },
      modifier: {
        id: '',
      },
    });

    const expected = {
      contact: 'yhteentoimivuus@dvv.fi',
      languages: [
        {
          description: 'kuvaus',
          labelText: 'fi',
          selected: true,
          title: 'testi fi',
          uniqueItemId: 'fi',
        },
        {
          description: undefined,
          labelText: 'en',
          selected: true,
          title: 'test en',
          uniqueItemId: 'en',
        },
      ],
      groups: [
        {
          checked: false,
          groupId: 'P10',
          labelText: 'Asuminen',
          name: 'Asuminen',
          uniqueItemId: 'P10',
        },
        {
          checked: false,
          groupId: 'P11',
          labelText: 'Demokratia',
          name: 'Demokratia',
          uniqueItemId: 'P11',
        },
      ],
      organizations: [
        {
          labelText: 'Yhteentoimivuusalustan yllapito',
          name: 'Yhteentoimivuusalustan yllapito',
          organizationId: '456-456',
          uniqueItemId: '456-456',
        },
      ],
      prefix: ['abc1234', true],
      status: 'DRAFT',
      type: 'TERMINOLOGICAL_VOCABULARY',
    };

    expect(returned).toStrictEqual(expected);
  });
});
