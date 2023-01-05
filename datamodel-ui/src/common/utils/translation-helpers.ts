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
      return t('missing-languages');
    case 'titleAmount':
      return t('missing-language-title');
    case 'prefix':
      return t('prefix-undefined');
    case 'serviceCategories':
      return t('missing-information-domain');
    case 'organizations':
      return t('missing-organizations');
    default:
      return t('profile');
  }
}
