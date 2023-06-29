import {
  ResourceFormType,
  initialAttribute,
  initialAssociation,
} from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

export const libraryAttributeSm: ResourceFormType = {
  ...initialAttribute,
  label: { fi: 'label-fi' },
  identifier: 'attr-identifier',
};

export const libraryAssociationSm: ResourceFormType = {
  ...initialAssociation,
  label: { fi: 'label-fi' },
  identifier: 'assoc-identifier',
};

export const libraryAttribute: ResourceFormType = {
  label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
  editorialNote: 'editorial note',
  concept: {
    label: { fi: 'concept-fi', en: 'concept-en', fr: 'concept-fr' },
    definition: { fi: 'def-fi', en: 'def-en', fr: 'def-fr' },
    conceptURI: 'concept-uri',
    status: 'VALID',
    terminology: {
      label: { fi: 'term-fi', en: 'term-en', fr: 'term-fr' },
      uri: 'term-uri',
    },
  },
  identifier: 'attr-identifier',
  status: 'VALID',
  equivalentResource: [
    {
      label: { fi: 'eq-1-fi', en: 'eq-1-en', fr: 'eq-1-fr' },
      identifier: 'eq-1',
    },
    {
      label: { fi: 'eq-2-fi', en: 'eq-2-en', fr: 'eq-2-fr' },
      identifier: 'eq-2',
    },
  ],
  subResourceOf: ['sub-1', 'sub-2'],
  note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
  type: ResourceType.ATTRIBUTE,
  range: {
    id: 'range-id',
    label: 'range-label',
  },
  domain: {
    id: 'domain-id',
    label: 'domain-label',
  },
};

export const libraryAssociation: ResourceFormType = {
  label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
  editorialNote: 'editorial note',
  concept: {
    label: { fi: 'concept-fi', en: 'concept-en', fr: 'concept-fr' },
    definition: { fi: 'def-fi', en: 'def-en', fr: 'def-fr' },
    conceptURI: 'concept-uri',
    status: 'VALID',
    terminology: {
      label: { fi: 'term-fi', en: 'term-en', fr: 'term-fr' },
      uri: 'term-uri',
    },
  },
  identifier: 'assoc-identifier',
  status: 'VALID',
  equivalentResource: [
    {
      label: { fi: 'eq-1-fi', en: 'eq-1-en', fr: 'eq-1-fr' },
      identifier: 'eq-1',
    },
    {
      label: { fi: 'eq-2-fi', en: 'eq-2-en', fr: 'eq-2-fr' },
      identifier: 'eq-2',
    },
  ],
  subResourceOf: ['sub-1', 'sub-2'],
  note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
  type: ResourceType.ASSOCIATION,
  range: {
    id: 'range-id',
    label: 'range-label',
  },
  domain: {
    id: 'domain-id',
    label: 'domain-label',
  },
};

export const applicationProfileAttributeSm: ResourceFormType = {
  ...initialAttribute,
  label: { fi: 'label-fi' },
  identifier: 'attr-identifier',
  type: ResourceType.ATTRIBUTE,
  range: undefined,
};

export const applicationProfileAssociationSm: ResourceFormType = {
  ...initialAssociation,
  label: { fi: 'label-fi' },
  identifier: 'attr-identifier',
  type: ResourceType.ASSOCIATION,
};

export const applicationProfileAttribute: ResourceFormType = {
  label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
  editorialNote: 'editorial note',
  concept: {
    label: { fi: 'concept-fi', en: 'concept-en', fr: 'concept-fr' },
    definition: { fi: 'def-fi', en: 'def-en', fr: 'def-fr' },
    conceptURI: 'concept-uri',
    status: 'VALID',
    terminology: {
      label: { fi: 'term-fi', en: 'term-en', fr: 'term-fr' },
      uri: 'term-uri',
    },
  },
  identifier: 'attr-identifier',
  status: 'VALID',
  note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
  path: 'path',
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

export const applicationProfileAssociation: ResourceFormType = {
  label: { fi: 'label-fi', en: 'label-en', fr: 'label-fr' },
  editorialNote: 'editorial note',
  concept: {
    label: { fi: 'concept-fi', en: 'concept-en', fr: 'concept-fr' },
    definition: { fi: 'def-fi', en: 'def-en', fr: 'def-fr' },
    conceptURI: 'concept-uri',
    status: 'VALID',
    terminology: {
      label: { fi: 'term-fi', en: 'term-en', fr: 'term-fr' },
      uri: 'term-uri',
    },
  },
  identifier: 'attr-identifier',
  status: 'VALID',
  note: { fi: 'note-fi', en: 'note-en', fr: 'note-fr' },
  path: 'path',
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
