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
  }
}

export function translateWordClass(wordClass: string, t: TFunction) {
  switch (wordClass) {
    case 'adjective':
      return t('adjective', { ns: 'admin' });
    case 'verb':
      return t('verb', { ns: 'admin' });
    default:
      return wordClass;
  }
}

export function translateTerminologyType(
  type: string | undefined,
  t: TFunction
) {
  switch (type) {
    case 'TERMINOLOGICAL_VOCABULARY':
      return t('TERMINOLOGICAL_VOCABULARY', { ns: 'common' });
    case 'OTHER_VOCABULARY':
      return t('OTHER_VOCABULARY', { ns: 'common' });
    default:
      return t('terminology-type-undefined', { ns: 'common' });
  }
}
