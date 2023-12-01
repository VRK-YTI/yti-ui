import {
  ApplicationProfileResourcePutType,
  LibraryResourcePutType,
  convertToPayload,
} from './utils';
import {
  applicationProfileAssociation,
  applicationProfileAssociationSm,
  applicationProfileAttribute,
  applicationProfileAttributeSm,
  libraryAssociation,
  libraryAssociationSm,
  libraryAttribute,
  libraryAttributeSm,
} from './resource-utils-data';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

describe('resource-utils', () => {
  it('should return payload for the most simple new library attribute', () => {
    const gotten = convertToPayload(libraryAttributeSm, false);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi' },
      identifier: 'attr-identifier',
      range: 'http://www.w3.org/2000/01/rdf-schema#Literal',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the most simple new library association', () => {
    const gotten = convertToPayload(libraryAssociationSm, false);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi' },
      identifier: 'assoc-identifier',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the entirely filled new library attribute', () => {
    const gotten = convertToPayload(libraryAttribute, false);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      identifier: 'attr-identifier',
      equivalentResource: ['eq-1', 'eq-2'],
      subResourceOf: ['sub-1', 'sub-2'],
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      range: 'range-id',
      domain: 'domain-id',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the entirely filled new library association', () => {
    const gotten = convertToPayload(libraryAssociation, false);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      identifier: 'assoc-identifier',
      equivalentResource: ['eq-1', 'eq-2'],
      subResourceOf: ['sub-1', 'sub-2'],
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      range: 'range-id',
      domain: 'domain-id',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the edited library attribute', () => {
    const gotten = convertToPayload(libraryAttribute, true);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      equivalentResource: ['eq-1', 'eq-2'],
      subResourceOf: ['sub-1', 'sub-2'],
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      range: 'range-id',
      domain: 'domain-id',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the edited library association', () => {
    const gotten = convertToPayload(libraryAssociation, true);

    const expected: LibraryResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      equivalentResource: ['eq-1', 'eq-2'],
      subResourceOf: ['sub-1', 'sub-2'],
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      range: 'range-id',
      domain: 'domain-id',
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the most simple new application profile attribute', () => {
    const gotten = convertToPayload(applicationProfileAttributeSm, false, true);

    const expected: ApplicationProfileResourcePutType = {
      label: { fi: 'label-fi' },
      identifier: 'attr-identifier',
      type: ResourceType.ATTRIBUTE,
    };
    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the most simple new application profile association', () => {
    const gotten = convertToPayload(
      applicationProfileAssociationSm,
      false,
      true
    );

    const expected: ApplicationProfileResourcePutType = {
      label: { fi: 'label-fi' },
      identifier: 'attr-identifier',
      type: ResourceType.ASSOCIATION,
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the entirely filled new application profile attribute', () => {
    const gotten = convertToPayload(applicationProfileAttribute, false, true);

    const expected: ApplicationProfileResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      identifier: 'attr-identifier',
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      path: 'path-uri',
      classType: 'class-type',
      type: ResourceType.ATTRIBUTE,
      dataType: 'data-type',
      allowedValues: ['allowed-1', 'allowed-2'],
      defaultValue: 'default-value',
      hasValue: 'has-value',
      maxLength: 10,
      minLength: 1,
      maxCount: 10,
      minCount: 1,
    };

    expect(gotten).toStrictEqual(expected);
  });

  it('should return payload for the entirely filled new application profile association', () => {
    const gotten = convertToPayload(applicationProfileAssociation, false, true);

    const expected: ApplicationProfileResourcePutType = {
      label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
      editorialNote: 'editorial note',
      subject: 'concept-uri',
      identifier: 'attr-identifier',
      note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
      path: 'path-uri',
      classType: 'class-type',
      type: ResourceType.ASSOCIATION,
      dataType: 'data-type',
      allowedValues: ['allowed-1', 'allowed-2'],
      defaultValue: 'default-value',
      hasValue: 'has-value',
      maxLength: 10,
      minLength: 1,
      maxCount: 10,
      minCount: 1,
    };

    expect(gotten).toStrictEqual(expected);
  });
});
