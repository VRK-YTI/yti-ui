import generateConcept from './generate-concept';
import {
  conceptWithInternalRelations,
  conceptWithOneTerm,
  conceptWithOneTermWithInitialData,
  differentTerms,
  removeTerm,
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
          source: [],
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
        status: 'DRAFT',
        subject: '',
        note: [],
        diagramAndSource: {
          diagrams: [],
          sources: [],
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
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    });

    const save = returned.save.map((json) => {
      // Replacing generated time stamps with expected values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';
      return json;
    });

    // Replacing the last object's id with expected value
    // since it's randombly generated in the function
    save[1].id = '1';

    expect(returned).toStrictEqual(conceptWithOneTerm);
  });

  it('should generate concept with one term with initial data provided', () => {
    const input = {
      terms: [
        {
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: '789',
          language: 'fi',
          prefLabel: 'prefLabel',
          scope: '',
          source: [],
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
        status: 'DRAFT',
        subject: '',
        note: [],
        diagramAndSource: {
          diagrams: [],
          sources: [],
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
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
      initialValue: {
        code: 'concept-1000',
        createdBy: 'Admin User',
        createdDate: '1970-01-01T00:00:00.000Z',
        id: '123',
        identifier: {
          id: '123',
          type: {
            graph: {
              id: '456',
            },
            id: 'Concept',
            uri: '',
          },
        },
        lastModifiedBy: 'Admin User',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        number: 0,
        properties: {
          status: [{ lang: '', value: 'DRAFT', regex: '(?s)^.*$' }],
        },
        references: {
          prefLabelXl: [
            {
              code: 'term-1000',
              createdBy: 'Admin User',
              createdDate: '1970-01-01T00:00:00.000Z',
              id: '789',
              identifier: {
                id: '789',
                type: {
                  graph: {
                    id: '456',
                  },
                  id: 'Term',
                  uri: '',
                },
              },
              lastModifiedBy: 'Admin User',
              lastModifiedDate: '1970-01-01T00:00:00.000Z',
              number: 0,
              properties: {
                prefLabel: [
                  {
                    lang: 'fi',
                    value: 'termi',
                    regex: '(?s)^.*$',
                  },
                ],
                status: [{ lang: '', value: 'DRAFT', regex: '(?s)^.*$' }],
              },
              references: {},
              referrers: {
                prefLabelXl: [
                  {
                    code: 'concept-1000',
                    createdBy: 'Admin User',
                    createdDate: '1970-01-01T00:00:00.000Z',
                    id: '123',
                    identifier: {
                      id: '123',
                      type: {
                        graph: {
                          id: '456',
                        },
                        id: 'Concept',
                        uri: '',
                      },
                    },
                    number: 0,
                    properties: {
                      status: [{ lang: '', value: 'DRAFT', regex: '(?s)^.*$' }],
                    },
                    references: {},
                    referreres: {},
                    type: {
                      graph: {
                        id: '456',
                      },
                      id: 'Concept',
                      uri: '',
                    },
                    uri: 'sanastot.suomi.fi/sanasto/concept-1000',
                  },
                ],
              },
              type: {
                graph: {
                  id: '456',
                },
                id: 'Term',
                uri: '',
              },
              uri: 'sanastot.suomi.fi/sanasto/term-1000',
            },
          ],
        },
        referrers: {},
        type: {
          graph: {
            id: '456',
          },
          id: 'Concept',
          uri: '',
        },
        uri: 'sanastot.suomi.fi/sanasto/concept-1000',
      },
      lastModifiedBy: 'Admin User',
    });
    const save = returned.save.map((json) => {
      // Replacing generated time stamps with expected values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';
      return json;
    });

    // Replacing the last object's id with expected value
    // since it's randombly generated in the function
    save[1].id = '1';

    expect(returned).toStrictEqual(conceptWithOneTermWithInitialData);
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
          source: [],
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
        status: 'DRAFT',
        subject: '',
        note: [],
        diagramAndSource: {
          diagrams: [],
          sources: [],
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
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    });
    const save = returned.save.map((json) => {
      // Replacing generated ids and time stamps with known values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';

      return json;
    });

    const expected = conceptWithInternalRelations;
    const lastObjectId = save[1].id;

    // Changing expected values last object's id to match
    // what's returned. expected-value set id randomly
    expected.save[1].id = lastObjectId;

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
          source: [
            {
              id: '6ef5a9b4-3843-4865-92ae-513d767f2636',
              lang: '',
              value: 'lähteet',
            },
          ],
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
          source: [
            {
              id: '6ef5a9b4-3843-4865-92ae-513d767f2636',
              lang: '',
              value: 'lähteet',
            },
          ],
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
          source: [
            {
              id: '6ef5a9b4-3843-4865-92ae-513d767f2636',
              lang: '',
              value: 'lähteet',
            },
          ],
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
          source: [
            {
              id: '6ef5a9b4-3843-4865-92ae-513d767f2636',
              lang: '',
              value: 'lähteet',
            },
          ],
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
        status: 'VALID',
        subject: 'aihealue',
        note: [
          {
            id: '0',
            lang: 'fi',
            value: 'huomautus',
          },
        ],
        diagramAndSource: {
          diagrams: [
            {
              id: '123',
              name: 'käsitekaavion nimi',
              url: 'käsitekaavion-verkko-osoite.fi',
              description: 'kuvaus',
            },
          ],
          sources: [
            {
              id: '0',
              lang: '',
              value: 'lähteet',
            },
          ],
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
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
    });
    const save = returned.save.map((json) => {
      // Replacing generated ids and time stamps with known values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';

      return json;
    });

    const expected = differentTerms;
    const lastObjectId = save[4].id;

    // Changing expected values last object's id to match
    // what's returned. expected-value set id randomly
    expected.save[4].id = lastObjectId;

    expect(returned).toStrictEqual(expected);
  });

  it('should remove term properly', () => {
    const input = {
      terms: [
        {
          changeNote: '',
          draftComment: '',
          editorialNote: [],
          historyNote: '',
          id: '0',
          language: 'fi',
          prefLabel: 'demo fi',
          scope: '',
          source: [],
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
        status: 'DRAFT',
        subject: '',
        note: [],
        diagramAndSource: {
          diagrams: [],
          sources: [],
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
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };

    const returned = generateConcept({
      data: input,
      terminologyId: 'terminologyId',
      initialValue: {
        id: 'abad6405-2843-42e3-bacd-9448e34fd049',
        code: 'concept-1',
        uri: 'http://uri.suomi.fi/terminology/212e3cf8/concept-1',
        number: 0,
        createdBy: '',
        createdDate: '1970-01-01T00:00:00.000Z',
        lastModifiedBy: '',
        lastModifiedDate: '1970-01-01T00:00:00.000Z',
        type: {
          id: 'Concept',
          graph: {
            id: 'terminologyId',
          },
          uri: '',
        },
        properties: {
          status: [
            {
              lang: '',
              value: 'DRAFT',
              regex: '(?s)^.* $',
            },
          ],
        },
        references: {
          prefLabelXl: [
            {
              id: '0',
              code: 'term-3',
              uri: 'http://uri.suomi.fi/terminology/212e3cf8/term-3',
              number: 0,
              createdBy: '',
              createdDate: '1970-01-01T00:00:00.000Z',
              lastModifiedBy: '',
              lastModifiedDate: '1970-01-01T00:00:00.000Z',
              type: {
                id: 'Term',
                graph: {
                  id: 'terminologyId',
                },
                uri: '',
              },
              properties: {
                prefLabel: [
                  {
                    lang: 'fi',
                    value: 'demo fi',
                    regex: '(?s)^.* $',
                  },
                ],
                status: [
                  {
                    lang: '',
                    value: 'DRAFT',
                    regex: '(?s)^.* $',
                  },
                ],
              },
              references: {},
              referrers: {
                prefLabelXl: [
                  {
                    id: 'abad6405-2843-42e3-bacd-9448e34fd049',
                    code: 'concept-1',
                    uri: 'http://uri.suomi.fi/terminology/212e3cf8/concept-1',
                    number: 0,
                    createdDate: '1970-01-01T00:00:00.000Z',
                    lastModifiedDate: '1970-01-01T00:00:00.000Z',
                    type: {
                      id: 'Concept',
                      graph: {
                        id: 'terminologyId',
                      },
                      uri: '',
                    },
                    properties: {
                      status: [
                        {
                          lang: '',
                          value: 'DRAFT',
                          regex: '(?s)^.* $',
                        },
                      ],
                    },
                    references: {},
                    referrers: {},
                    identifier: {
                      id: 'abad6405-2843-42e3-bacd-9448e34fd049',
                      type: {
                        id: 'Concept',
                        graph: {
                          id: 'terminologyId',
                        },
                        uri: '',
                      },
                    },
                  },
                ],
              },
              identifier: {
                id: 'd17ed9bb-1c1f-4b46-a63d-648130e7ba19',
                type: {
                  id: 'Term',
                  graph: {
                    id: 'terminologyId',
                  },
                  uri: '',
                },
              },
            },
            {
              id: 'ffd68efb-d5c8-4ea2-9fb8-fa7b0b688fe9',
              code: 'term-4',
              uri: 'http://uri.suomi.fi/terminology/212e3cf8/term-4',
              number: 0,
              createdBy: '',
              createdDate: '2022-09-28T07:35:08.000+00:00',
              lastModifiedBy: '',
              lastModifiedDate: '2022-09-28T07:35:08.000+00:00',
              type: {
                id: 'Term',
                graph: {
                  id: 'terminologyId',
                },
                uri: '',
              },
              properties: {
                prefLabel: [
                  {
                    lang: 'en',
                    value: 'demo en',
                    regex: '(?s)^.* $',
                  },
                ],
                status: [
                  {
                    lang: '',
                    value: 'DRAFT',
                    regex: '(?s)^.* $',
                  },
                ],
              },
              references: {},
              referrers: {
                prefLabelXl: [
                  {
                    id: 'abad6405-2843-42e3-bacd-9448e34fd049',
                    code: 'concept-1',
                    uri: 'http://uri.suomi.fi/terminology/212e3cf8/concept-1',
                    number: 0,
                    createdDate: '2022-09-28T07:34:46.000+00: 00',
                    lastModifiedDate: '2022-09-28T07:35:08.000+00: 00',
                    type: {
                      id: 'Concept',
                      graph: {
                        id: 'terminologyId',
                      },
                      uri: '',
                    },
                    properties: {
                      status: [
                        {
                          lang: '',
                          value: 'DRAFT',
                          regex: '(?s)^.* $',
                        },
                      ],
                    },
                    references: {},
                    referrers: {},
                    identifier: {
                      id: 'abad6405-2843-42e3-bacd-9448e34fd049',
                      type: {
                        id: 'Concept',
                        graph: {
                          id: 'terminologyId',
                        },
                        uri: '',
                      },
                    },
                  },
                ],
              },
              identifier: {
                id: 'ffd68efb-d5c8-4ea2-9fb8-fa7b0b688fe9',
                type: {
                  id: 'Term',
                  graph: {
                    id: 'terminologyId',
                  },
                  uri: '',
                },
              },
            },
          ],
        },
        referrers: {},
        identifier: {
          id: 'abad6405-2843-42e3-bacd-9448e34fd049',
          type: {
            id: 'Concept',
            graph: {
              id: 'terminologyId',
            },
            uri: '',
          },
        },
      },
    });
    const save = returned.save.map((json) => {
      // Replacing generated ids and time stamps with known values
      json.createdDate = '1970-01-01T00:00:00.000Z';
      json.lastModifiedDate = '1970-01-01T00:00:00.000Z';

      return json;
    });

    const expected = removeTerm;
    const lastObjectId = save[1].id;

    // Changing expected values last object's id to match
    // what's returned. expected-value set id randomly
    returned.save[1].id = lastObjectId;

    expect(returned).toStrictEqual(expected);
  });
});
