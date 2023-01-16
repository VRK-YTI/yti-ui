import { TFunction } from 'next-i18next';

export function translateModelType(type: string, t: TFunction) {
  switch (type) {
    case 'library':
      return t('library');
    case 'profile':
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
