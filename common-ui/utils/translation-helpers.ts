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
