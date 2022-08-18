import { FormError } from '@app/modules/edit-concept/validate-form';
import { TFunction } from 'next-i18next';

export function translateStatus(status: string, t: TFunction) {
  switch (status) {
    case 'DRAFT':
      return t('statuses.draft', { ns: 'common' });
    case 'INCOMPLETE':
      return t('statuses.incomplete', { ns: 'common' });
    case 'INVALID':
      return t('statuses.invalid', { ns: 'common' });
    case 'RETIRED':
      return t('statuses.retired', { ns: 'common' });
    case 'SUGGESTED':
      return t('statuses.suggested', { ns: 'common' });
    case 'SUPERSEDED':
      return t('statuses.superseded', { ns: 'common' });
    case 'VALID':
      return t('statuses.valid', { ns: 'common' });
    default:
      return status;
  }
}

export function translateLanguage(language: string, t: TFunction) {
  switch (language) {
    case 'fi':
      return t('languages.fi', { ns: 'common' });
    case 'en':
      return t('languages.en', { ns: 'common' });
    case 'sv':
      return t('languages.sv', { ns: 'common' });
    default:
      return language;
  }
}

export function translateRole(role: string, t: TFunction) {
  switch (role) {
    case 'ADMIN':
      return t('roles.admin', { ns: 'common' });
    case 'CODE_LIST_EDITOR':
      return t('roles.code-list-editor', { ns: 'common' });
    case 'DATA_MODEL_EDITOR':
      return t('roles.data-model-editor', { ns: 'common' });
    case 'MEMBER':
      return t('roles.member', { ns: 'common' });
    case 'TERMINOLOGY_EDITOR':
      return t('roles.terminology-editor', { ns: 'common' });
    default:
      return role;
  }
}

export function translateTermType(type: string, t: TFunction) {
  switch (type) {
    case 'recommended-term':
      return t('recommended-term', { ns: 'common' });
    case 'synonym':
      return t('synonym', { ns: 'common' });
    case 'not-recommended-synonym':
      return t('not-recommended-synonym', { ns: 'common' });
    case 'search-term':
      return t('search-term', { ns: 'common' });
    default:
      return type;
  }
}

export function translateTerminologyType(type: string, t: TFunction) {
  switch (type) {
    case 'TERMINOLOGICAL_VOCABULARY':
      return t('terminology-type.terminologyical-vocabulary', { ns: 'common' });
    case 'OTHER_VOCABULARY':
      return t('terminology-type.other-vocabulary', { ns: 'common' });
    default:
      return t('terminology-type.undefined', { ns: 'common' });
  }
}

export function translateTermStyle(termStyle: string, t: TFunction) {
  switch (termStyle) {
    case 'spoken-form':
      return t('term-style.spoken-form', { ns: 'common' });
    default:
      return termStyle;
  }
}

export function translateTermFamily(termFamily: string, t: TFunction) {
  switch (termFamily) {
    case 'masculine':
      return t('term-family.masculine', { ns: 'common' });
    case 'neutral':
      return t('term-family.neutral', { ns: 'common' });
    case 'feminine':
      return t('term-family.feminine', { ns: 'common' });
    default:
      return termFamily;
  }
}

export function translateTermConjugation(
  termConjugation: string,
  t: TFunction
) {
  switch (termConjugation) {
    case 'singular':
      return t('term-conjugation.singular', { ns: 'common' });
    case 'plural':
      return t('term-conjugation.plural', { ns: 'common' });
    default:
      return termConjugation;
  }
}

export function translateWordClass(wordClass: string, t: TFunction) {
  switch (wordClass) {
    case 'adjective':
      return t('word-class.adjective', { ns: 'common' });
    case 'verb':
      return t('word-class.verb', { ns: 'common' });
    default:
      return wordClass;
  }
}

export function translateEditConceptError(
  error: keyof FormError,
  t: TFunction
) {
  switch (error) {
    case 'editorialNote':
      return t('edit-concept-error.editorialNote', { ns: 'admin' });
    case 'example':
      return t('edit-concept-error.example', { ns: 'admin' });
    case 'note':
      return t('edit-concept-error.note', { ns: 'admin' });
    case 'recommendedTerms':
      return t('edit-concept-error.recommendedTerms', { ns: 'admin' });
    case 'termPrefLabel':
      return t('edit-concept-error.termPrefLabel', { ns: 'admin' });
    default:
      return t('edit-concept-error.default', { ns: 'admin' });
  }
}
