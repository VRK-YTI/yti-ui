import { TFunction } from 'next-i18next';

export function translateStatus(status: string, t: TFunction) {
  switch (status) {
    case 'DRAFT':
      return t('DRAFT', { ns: 'common' });
    case 'INCOMPLETE':
      return t('INCOMPLETE', { ns: 'common' });
    case 'INVALID':
      return t('INVALID', { ns: 'common' });
    case 'RETIRED':
      return t('RETIRED', { ns: 'common' });
    case 'SUGGESTED':
      return t('SUGGESTED', { ns: 'common' });
    case 'SUPERSEDED':
      return t('SUPERSEDED', { ns: 'common' });
    case 'VALID':
      return t('VALID', { ns: 'common' });
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
      return t('ADMIN', { ns: 'common' });
    case 'CODE_LIST_EDITOR':
      return t('CODE_LIST_EDITOR', { ns: 'common' });
    case 'DATA_MODEL_EDITOR':
      return t('DATA_MODEL_EDITOR', { ns: 'common' });
    case 'MEMBER':
      return t('MEMBER', { ns: 'common' });
    case 'TERMINOLOGY_EDITOR':
      return t('TERMINOLOGY_EDITOR', { ns: 'common' });
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
