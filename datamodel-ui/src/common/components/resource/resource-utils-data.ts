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
      label: 'eq-1',
      uri: 'eq-1',
    },
    {
      label: 'eq-2',
      uri: 'eq-2',
    },
  ],
  subResourceOf: [
    {
      label: 'sub-1',
      uri: 'sub-1',
    },
    {
      label: 'sub-2',
      uri: 'sub-2',
    },
  ],
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
      label: 'eq-1',
      uri: 'eq-1',
    },
    {
      label: 'eq-2',
      uri: 'eq-2',
    },
  ],
  subResourceOf: [
    {
      label: 'sub-1',
      uri: 'sub-1',
    },
    {
      label: 'sub-2',
      uri: 'sub-2',
    },
  ],
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
  path: { id: 'path', label: 'path', uri: 'path-uri' },
  classType: 'class-type',
  type: ResourceType.ATTRIBUTE,
  dataType: { id: 'data-type', label: 'data-type' },
  allowedValues: [
    { id: 'allowed-1', label: 'allowed-1' },
    { id: 'allowed-2', label: 'allowed-2' },
  ],
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
  path: { id: 'path', label: 'path', uri: 'path-uri' },
  classType: 'class-type',
  type: ResourceType.ASSOCIATION,
  dataType: { id: 'data-type', label: 'data-type' },
  allowedValues: [
    { id: 'allowed-1', label: 'allowed-1' },
    { id: 'allowed-2', label: 'allowed-2' },
  ],
  defaultValue: 'default-value',
  hasValue: 'has-value',
  maxLength: 10,
  minLength: 1,
  maxCount: 10,
  minCount: 1,
};
