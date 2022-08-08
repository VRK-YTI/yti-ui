import generateConcept from './generate-concept';
import {
  conceptWithInternalRelations,
  conceptWithOneTerm,
  differentTerms,
} from './generate-concept-test-expected';

describe('generate-concept', () => {
  it('should generate concept with one term', () => {
    const input = {
      terms: [
        {
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: '0',
          language: 'fi',
          prefLabel: 'prefLabel',
          scope: '',
          source: '',
          status: 'draft',
          termConjugation: '',
          termEquivalency: '',
          termEquivalencyRelation: '',
          termFamily: '',
          termHomographNumber: '',
          termInfo: '',
          termStyle: '',
          termType: 'recommended-term',
          wordClass: '',
        },
      ],
      basicInformation: {
        definition: {},
        example: [],
        subject: '',
        note: [],
        diagramAndSource: {
          diagram: [],
          sources: '',
        },
        orgInfo: {
          changeHistory: '',
          editorialNote: [],
          etymology: '',
        },
        otherInfo: {
          conceptClass: '',
          wordClass: '',
        },
        relationalInfo: {
          broaderConcept: [],
          narrowerConcept: [],
          relatedConcept: [],
          isPartOfConcept: [],
          hasPartConcept: [],
          relatedConceptInOther: [],
          matchInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    }).map((json) => {
      // Replacing generated time stamps with expected values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';
      return json;
    });

    // Replacing the last object's id with expected value
    // since it's randombly generated in the function
    returned[1].id = '1';

    expect(returned).toStrictEqual(conceptWithOneTerm);
  });

  it('should generate concept with one term that has relations to same vocabulary concepts', () => {
    const input = {
      terms: [
        {
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: '0',
          language: 'fi',
          prefLabel: 'prefLabel',
          scope: '',
          source: '',
          status: 'draft',
          termConjugation: '',
          termEquivalency: '',
          termEquivalencyRelation: '',
          termFamily: '',
          termHomographNumber: '',
          termInfo: '',
          termStyle: '',
          termType: 'recommended-term',
          wordClass: '',
        },
      ],
      basicInformation: {
        definition: {},
        example: [],
        subject: '',
        note: [],
        diagramAndSource: {
          diagram: [],
          sources: '',
        },
        orgInfo: {
          changeHistory: '',
          editorialNote: [],
          etymology: '',
        },
        otherInfo: {
          conceptClass: '',
          wordClass: '',
        },
        relationalInfo: {
          broaderConcept: [
            {
              id: '148ab016-36ee-486a-862a-87d6dde2f86f',
              label: {
                fi: 'other concept',
              },
              terminologyId: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              terminologyLabel: {
                fi: 'demo terminology',
              },
            },
          ],
          narrowerConcept: [
            {
              id: '148ab016-36ee-486a-862a-87d6dde2f86f',
              label: {
                fi: 'other concept',
              },
              terminologyId: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              terminologyLabel: {
                fi: 'demo terminology',
              },
            },
          ],
          relatedConcept: [
            {
              id: '148ab016-36ee-486a-862a-87d6dde2f86f',
              label: {
                fi: 'other concept',
              },
              terminologyId: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              terminologyLabel: {
                fi: 'demo terminology',
              },
            },
          ],
          isPartOfConcept: [
            {
              id: '148ab016-36ee-486a-862a-87d6dde2f86f',
              label: {
                fi: 'other concept',
              },
              terminologyId: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              terminologyLabel: {
                fi: 'demo terminology',
              },
            },
          ],
          hasPartConcept: [
            {
              id: '148ab016-36ee-486a-862a-87d6dde2f86f',
              label: {
                fi: 'other concept',
              },
              terminologyId: '747340b9-8ab6-4aa4-b4e6-5327813505e5',
              terminologyLabel: {
                fi: 'demo terminology',
              },
            },
          ],
          relatedConceptInOther: [],
          matchInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    }).map((json) => {
      // Replacing generated ids and time stamps with known values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';

      return json;
    });

    const expected = conceptWithInternalRelations;
    const lastObjectId = returned[1].id;

    // Changing expected values last object's id to match
    // what's returned. expected-value set id randomly
    expected[1].id = lastObjectId;

    expect(returned).toStrictEqual(expected);
  });

  it('should generate concept with different term types filled with info', () => {
    const input = {
      terms: [
        {
          changeNote: 'muutoshistoria',
          draftComment: '',
          editorialNote: [
            {
              id: '5872b40f-7aa7-4b5a-9071-2c7b891d1ca2',
              lang: '',
              value: 'ylläpitäjän muistiinpano',
            },
          ],
          historyNote: 'käytön historiatieto',
          id: '0',
          language: 'fi',
          prefLabel: 'demo',
          scope: 'käyttöala',
          source: 'lähteet',
          status: 'draft',
          termConjugation: 'singular',
          termEquivalency: '',
          termEquivalencyRelation: '',
          termFamily: 'feminine',
          termHomographNumber: '1',
          termInfo: 'termin lisätieto',
          termStyle: 'spoken-form',
          termType: 'recommended-term',
          wordClass: 'adjective',
        },
        {
          changeNote: 'muutoshistoria',
          draftComment: '',
          editorialNote: [
            {
              id: 'e313db56-8fc2-48e7-9edd-37dec25a568f',
              lang: '',
              value: 'ylläpitäjän muistiinpano',
            },
          ],
          historyNote: 'käytön historiatieto',
          id: '1',
          language: 'fi',
          prefLabel: 'synonyymi',
          scope: 'käyttöala',
          source: 'lähteet',
          status: 'draft',
          termConjugation: 'singular',
          termEquivalency: '~',
          termEquivalencyRelation: '',
          termFamily: 'feminine',
          termHomographNumber: '1',
          termInfo: 'termin lisätieto',
          termStyle: 'spoken-form',
          termType: 'synonym',
          wordClass: 'adjective',
        },
        {
          changeNote: 'muutoshistoria',
          draftComment: '',
          editorialNote: [
            {
              id: '199cf1f5-88ee-409b-b369-4a54010112dd',
              lang: '',
              value: 'ylläpitäjän muistiinpano',
            },
          ],
          historyNote: 'käytön historiatieto',
          id: '2',
          language: 'fi',
          prefLabel: 'ei-suositettava synonyymi',
          scope: 'käyttöala',
          source: 'lähteet',
          status: 'draft',
          termConjugation: 'singular',
          termEquivalency: '~',
          termEquivalencyRelation: '',
          termFamily: 'feminine',
          termHomographNumber: '1',
          termInfo: 'termin lisätieto',
          termStyle: 'spoken-form',
          termType: 'not-recommended-synonym',
          wordClass: 'adjective',
        },
        {
          changeNote: 'muutoshistoria',
          draftComment: '',
          editorialNote: [
            {
              id: '065d619c-ddd1-4b32-b92c-1063d84bf233',
              lang: '',
              value: 'ylläpitäjän muistiinpano',
            },
          ],
          historyNote: 'käytön historiatieto',
          id: '3',
          language: 'fi',
          prefLabel: 'hakusana',
          scope: 'käyttöala',
          source: 'lähteet',
          status: 'draft',
          termConjugation: 'singular',
          termEquivalency: '~',
          termEquivalencyRelation: '',
          termFamily: 'feminine',
          termHomographNumber: '1',
          termInfo: 'termin lisätieto',
          termStyle: 'spoken-form',
          termType: 'search-term',
          wordClass: 'adjective',
        },
      ],
      basicInformation: {
        definition: {
          fi: 'määritelmä',
        },
        example: [
          {
            id: '0',
            lang: 'fi',
            value: 'käyttöesimerkki',
          },
        ],
        subject: 'aihealue',
        note: [
          {
            id: '0',
            lang: 'fi',
            value: 'huomautus',
          },
        ],
        diagramAndSource: {
          diagram: [
            {
              diagramName: 'käsitekaavion nimi',
              diagramUrl: 'käsitekaavion verkko-osoite',
              description: 'kuvaus',
            },
          ],
          sources: 'lähteet',
        },
        orgInfo: {
          changeHistory: 'muutoshistoria',
          etymology: 'käytön historiatieto',
          editorialNote: [
            {
              id: '2967c823-b5b7-479b-9a91-61950bba511b',
              lang: '',
              value: 'ylläpitäjän muistiinpano',
            },
          ],
        },
        otherInfo: {
          conceptClass: 'käsitteen luokka',
          wordClass: 'adjective',
        },
        relationalInfo: {
          broaderConcept: [],
          narrowerConcept: [],
          relatedConcept: [],
          isPartOfConcept: [],
          hasPartConcept: [],
          relatedConceptInOther: [],
          matchInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    }).map((json) => {
      // Replacing generated ids and time stamps with known values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';

      return json;
    });

    const expected = differentTerms;
    const lastObjectId = returned[4].id;

    // Changing expected values last object's id to match
    // what's returned. expected-value set id randomly
    expected[4].id = lastObjectId;

    expect(returned).toStrictEqual(expected);
  });
});
