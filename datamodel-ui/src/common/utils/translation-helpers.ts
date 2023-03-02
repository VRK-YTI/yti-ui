import { TFunction } from 'next-i18next';
import { Type } from '../interfaces/type.interface';

export function translateModelType(type: Type, t: TFunction) {
  switch (type) {
    case 'LIBRARY':
      return t('library');
    case 'PROFILE':
      return t('profile');
    default:
      return t('profile');
  }
}

export function translateModelFormErrors(error: string, t: TFunction) {
  switch (error) {
    case 'languageAmount':
      return t('missing-languages', { ns: 'admin' });
    case 'titleAmount':
      return t('missing-language-title', { ns: 'admin' });
    case 'prefix':
      return t('missing-prefix', { ns: 'admin' });
    case 'serviceCategories':
      return t('missing-information-domain', { ns: 'admin' });
    case 'organizations':
      return t('missing-organizations', { ns: 'admin' });
    default:
      return t('missing-general', { ns: 'admin' });
  }
}

export function translateClassFormErrors(error: string, t: TFunction) {
  switch (error) {
    case 'identifier':
      return t('class-missing-identifier', { ns: 'admin' });
    case 'label':
      return t('class-missing-language-title', { ns: 'admin' });
    default:
      return t('class-missing-general', { ns: 'admin' });
  }
}

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
