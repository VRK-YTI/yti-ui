import generateNewConcept from './generate-new-concept';

describe('generate-new-concept', () => {
  it('should generate preferred term with all information', () => {
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

  it('should generate preferred term with only prefLabel', () => {
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


  it('should generate basic information', () => {
    const received = generateNewConcept({
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
    expect(received.save).toHaveLength(1);
    expect(received.save[0].properties.definition).toStrictEqual([
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
    expect(received.save[0].properties.example).toStrictEqual([
      {
        lang: 'fi',
        regex: '(?s)^.*$',
        value: 'esimerkki'
      }
    ]);
    expect(received.save[0].properties.subjectArea).toStrictEqual([
      {
        lang: '',
        regex: '(?s)^.*$',
        value: 'subject'
      }
    ]);
    expect(received.save[0].properties.note).toStrictEqual([
      {
        lang: 'en',
        regex: '(?s)^.*$',
        value: 'note'
      }
    ]);
  });
});
