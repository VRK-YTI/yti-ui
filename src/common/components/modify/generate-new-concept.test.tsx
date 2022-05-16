import generateNewConcept from './generate-new-concept';

describe('generate-new-concept', () => {
  it('should generate a preferred term with all information', () => {
    const data = {
      terms: {
        preferredTerm: [
          {
            changeNote: 'muutoshistoriatieto',
            draftComment: 'luonnosvaiheen kommentti',
            editorialNote: 'ylläpitäjän muistiinpano',
            historyNote: 'käytön historiatieto',
            lang: 'fi',
            prefLabel: 'suositettava termi',
            scope: 'käyttöala',
            source: 'lähde',
            status: 'DRAFT',
            termConjugation: 'termin luku',
            termEquivalency: 'termin vastaavuus',
            termEquivalencyRelation: 'termi, johon vastaavuus liittyy',
            termFamily: 'termin suku',
            termHomographNumber: '1',
            termInfo: 'termin lisätieto',
            termStyle: 'termin tyyli',
            wordClass: 'sanaluokka'
          }
        ]
      }
    };

    const received = generateNewConcept(data, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    Object.keys(received.save[0].properties).map(key => {
      const preferredTerm = data.terms.preferredTerm[0];
      expect(received.save[0].properties[key]).toStrictEqual([{
        lang: key !== 'prefLabel' ? '' : 'fi',
        regex: '(?s)^.*$',
        value: preferredTerm[key]
      }]);
    });
  });

  it('should generate a preferred term with only prefLabel', () => {
    const data = {
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi'
          }
        ]
      }
    };

    const received = generateNewConcept(data, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(2);
    expect(received.save[0].properties.prefLabel).toStrictEqual([{
      lang: 'fi',
      regex: '(?s)^.*$',
      value: 'suositettava termi'
    }]);

    expect(received.save[0].properties.editorialNote).toStrictEqual([]);
    expect(received.save[0].properties.source).toStrictEqual([]);
    expect(received.save[0].properties.status).toStrictEqual([{
      lang: '',
      regex: '(?s)^.*$',
      value: 'DRAFT'
    }]);

    Object.keys(received.save[0].properties)
      .filter(key => {
        if (!['prefLabel', 'editorialNote', 'source', 'status'].includes(key)) {
          return true;
        }
      })
      .map(key => {
        expect(received.save[0].properties[key]).toStrictEqual(
          [{
            lang: '',
            regex: '(?s)^.*$',
            value: ''
          }]
        );
      });
  });

  it('should generate preferred terms with only prefLabel', () => {
    const data = {
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi fi'
          },
          {
            lang: 'en',
            prefLabel: 'suositettava termi en'
          }
        ]
      }
    };

    const received = generateNewConcept(data, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(3);

    for (let i = 0; i < 2; i++) {
      expect(received.save[i].properties.prefLabel).toStrictEqual([{
        lang: i === 0 ? 'fi' : 'en',
        regex: '(?s)^.*$',
        value: i === 0 ? 'suositettava termi fi' : 'suositettava termi en'
      }]);

      expect(received.save[i].properties.editorialNote).toStrictEqual([]);
      expect(received.save[i].properties.source).toStrictEqual([]);
      expect(received.save[i].properties.status).toStrictEqual([{
        lang: '',
        regex: '(?s)^.*$',
        value: 'DRAFT'
      }]);

      Object.keys(received.save[i].properties)
        .filter(key => {
          if (!['prefLabel', 'editorialNote', 'source', 'status'].includes(key)) {
            return true;
          }
        })
        .map(key => {
          expect(received.save[i].properties[key]).toStrictEqual(
            [{
              lang: '',
              regex: '(?s)^.*$',
              value: ''
            }]
          );
        });
    }

    expect(received.save[2].references.prefLabelXl).toHaveLength(2);
  });


  it('should generate basic information', () => {
    const received = generateNewConcept({
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi fi'
          },
        ]
      },
      definition: {
        fi: 'määritelmä',
        en: 'definition'
      },
      example: [
        {
          id: 0,
          lang: 'fi',
          value: 'esimerkki'
        }
      ],
      subject: 'subject',
      note: [
        {
          id: 0,
          lang: 'en',
          value: 'note'
        }
      ]
    }, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(2);
    expect(received.save[1].properties.definition).toStrictEqual([
      {
        lang: 'fi',
        regex: '(?s)^.*$',
        value: 'määritelmä'
      },
      {
        lang: 'en',
        regex: '(?s)^.*$',
        value: 'definition'
      }
    ]);
    expect(received.save[1].properties.example).toStrictEqual([
      {
        lang: 'fi',
        regex: '(?s)^.*$',
        value: 'esimerkki'
      }
    ]);
    expect(received.save[1].properties.subjectArea).toStrictEqual([
      {
        lang: '',
        regex: '(?s)^.*$',
        value: 'subject'
      }
    ]);
    expect(received.save[1].properties.note).toStrictEqual([
      {
        lang: 'en',
        regex: '(?s)^.*$',
        value: 'note'
      }
    ]);
  });

  it('should return null of no preferredTerms are defined', () => {
    const received = generateNewConcept({
      terms: {
        preferredTerm: []
      },
      definition: {
        fi: 'määritelmä',
        en: 'definition'
      },
      example: [
        {
          id: 0,
          lang: 'fi',
          value: 'esimerkki'
        }
      ],
      subject: 'subject',
      note: [
        {
          id: 0,
          lang: 'en',
          value: 'note'
        }
      ]
    }, '123-456-789');

    expect(received).toBeNull();
  });

  it('should generate organizational information', () => {
    const received = generateNewConcept({
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi fi'
          },
        ]
      },
      orgInfo: {
        changeHistory: 'muutoshistoriatieto',
        etymology: 'käytön historiatieto'
      }
    }, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(2);
    expect(received.save[1].properties.changeNote).toStrictEqual([{
      lang: '',
      regex: '(?s)^.*$',
      value: 'muutoshistoriatieto'
    }]);
    expect(received.save[1].properties.historyNote).toStrictEqual([{
      lang: '',
      regex: '(?s)^.*$',
      value: 'käytön historiatieto'
    }]);
  });

  it('should generate other information', () => {
    const received = generateNewConcept({
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi fi'
          },
        ]
      },
      otherInfo: {
        conceptClass: {
          uniqueItemId: '111-222',
          labelText: 'Asuminen'
        },
        wordClass: {
          uniqueItemId: 'verb',
          labelText: 'verbi'
        }
      }
    }, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(2);
    expect(received.save[1].properties.conceptClass).toStrictEqual([{
      lang: '',
      regex: '(?s)^.*$',
      value: 'Asuminen'
    }]);
    expect(received.save[1].properties.wordClass).toStrictEqual([{
      lang: '',
      regex: '(?s)^.*$',
      value: 'verb'
    }]);
  });

  it('should generate relational information', () => {
    const received = generateNewConcept({
      terms: {
        preferredTerm: [
          {
            lang: 'fi',
            prefLabel: 'suositettava termi fi'
          },
        ]
      },
      relationalInfo: {
        broaderConcept: [{
          id: '111-001'
        }],
        hasPartConcept: [{
          id: '111-004'
        }],
        isPartOfConcept: [{
          id: '111-005'
        }],
        matchInOther: [{
          id: '111-003',
          terminology: {
            id: '987-654-321'
          }
        }],
        narrowerConcept: [{
          id: '111-006'
        }],
        relatedConcept: [{
          id: '111-007'
        }],
        relatedConceptInOther: [{
          id: '111-002',
          terminology: {
            id: '987-654-321'
          }
        }],
      }
    }, '123-456-789');

    expect(received.delete).toStrictEqual([]);
    expect(received.save).toHaveLength(2);
    expect(received.save[1].references.broader).toStrictEqual([{
      id: '111-001',
      type: {
        graph: {
          id: '123-456-789'
        },
        id: 'Concept',
        uri: '',
      }
    }]);
    expect(received.save[1].references.closeMatch).toStrictEqual([{
      id: '111-002',
      type: {
        graph: {
          id: '987-654-321'
        },
        id: 'ConceptLink',
        uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
      }
    }]);
    expect(received.save[1].references.exactMatch).toStrictEqual([{
      id: '111-003',
      type: {
        graph: {
          id: '987-654-321'
        },
        id: 'ConceptLink',
        uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource',
      }
    }]);
    expect(received.save[1].references.hasPart).toStrictEqual([{
      id: '111-004',
      type: {
        graph: {
          id: '123-456-789'
        },
        id: 'Concept',
        uri: '',
      }
    }]);
    expect(received.save[1].references.isPartOf).toStrictEqual([{
      id: '111-005',
      type: {
        graph: {
          id: '123-456-789'
        },
        id: 'Concept',
        uri: '',
      }
    }]);
    expect(received.save[1].references.narrower).toStrictEqual([{
      id: '111-006',
      type: {
        graph: {
          id: '123-456-789'
        },
        id: 'Concept',
        uri: '',
      }
    }]);
    expect(received.save[1].references.related).toStrictEqual([{
      id: '111-007',
      type: {
        graph: {
          id: '123-456-789'
        },
        id: 'Concept',
        uri: '',
      }
    }]);
  });
});
