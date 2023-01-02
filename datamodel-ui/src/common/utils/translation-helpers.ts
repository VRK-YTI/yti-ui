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
