import { TFunction } from 'next-i18next';
import { ResourceType } from '../interfaces/resource-type.interface';
import { Type } from '../interfaces/type.interface';

export function translateModelType(type: Type, t: TFunction) {
  switch (type) {
    case 'LIBRARY':
      return t('library', { ns: 'common' });
    case 'PROFILE':
      return t('profile', { ns: 'common' });
    default:
      return t('profile', { ns: 'common' });
  }
}

export function translateResourceType(type: ResourceType, t: TFunction) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('association');
    case ResourceType.ATTRIBUTE:
      return t('attribute');
    default:
      return t('class');
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
    case 'prefixInitChar':
      return t('prefix-invalid-initial-character', { ns: 'admin' });
    case 'prefixLength':
      return t('prefix-invalid-length', { ns: 'admin' });
    case 'serviceCategories':
      return t('missing-information-domain', { ns: 'admin' });
    case 'organizations':
      return t('missing-organizations', { ns: 'admin' });
    case 'contact':
      return t('missing-contact', { ns: 'admin' });
    default:
      return t('missing-general', { ns: 'admin' });
  }
}

export function translateClassFormErrors(error: string, t: TFunction) {
  switch (error) {
    case 'identifier':
      return t('class-missing-identifier', { ns: 'admin' });
    case 'identifierInitChar':
      return t('class-invalid-identifier-first-character', { ns: 'admin' });
    case 'identifierLength':
      return t('class-invalid-identifier-length', { ns: 'admin' });
    case 'label':
      return t('class-missing-language-title', { ns: 'admin' });
    case 'unauthorized':
      return t('error-unauthenticated', { ns: 'admin' });
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

export function translateCommonForm(
  part: string,
  type: ResourceType,
  t: TFunction
) {
  switch (part) {
    case 'return':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.associations-return', { ns: 'common' })
        : t('common-view.attributes-return', { ns: 'common' });
    case 'name':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.associations-name', { ns: 'admin' })
        : t('common-form.attributes-name', { ns: 'admin' });
    case 'identifier':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.associations-identifier', { ns: 'admin' })
        : t('common-form.attributes-identifier', { ns: 'admin' });
    case 'upper':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.upper-associations', { ns: 'admin' })
        : t('common-form.upper-attributes', { ns: 'admin' });
    case 'no-upper':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.no-upper-associations', { ns: 'common' })
        : t('common-view.no-upper-attributes', { ns: 'common' });
    case 'add-upper':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.add-upper-association', { ns: 'admin' })
        : t('common-form.add-upper-attribute', { ns: 'admin' });
    case 'equivalent':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.equivalent-associations', { ns: 'admin' })
        : t('common-form.equivalent-attributes', { ns: 'admin' });
    case 'no-equivalent':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.no-equivalent-associations', { ns: 'common' })
        : t('common-view.no-equivalent-attributes', { ns: 'common' });
    case 'add-equivalent':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.add-equivalent-association', { ns: 'admin' })
        : t('common-form.add-equivalent-attribute', { ns: 'admin' });
    case 'note':
      return type === ResourceType.ASSOCIATION
        ? t('common-form.associations-note', { ns: 'admin' })
        : t('common-form.attributes-note', { ns: 'admin' });
    case 'work-group-comment':
      return t('common-form.work-group-comment', { ns: 'admin' });
    case 'contact':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.associations-contact', { ns: 'common' })
        : t('common-view.attributes-contact', { ns: 'common' });
    case 'contact-description':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.associations-contact-description', { ns: 'common' })
        : t('common-view.attributes-contact-description', { ns: 'common' });
    default:
      return '';
  }
}

export function translateCommonFormErrors(
  error: string,
  type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE,
  t: TFunction
) {
  switch (error) {
    case 'label':
      return type === ResourceType.ASSOCIATION
        ? t('association-missing-label', { ns: 'admin' })
        : t('attribute-missing-label', { ns: 'admin' });
    case 'identifier':
      return type === ResourceType.ASSOCIATION
        ? t('association-missing-identifier', { ns: 'admin' })
        : t('attribute-missing-identifier', { ns: 'admin' });
    case 'identifierInitChar':
      return type === ResourceType.ASSOCIATION
        ? t('association-invalid-identifier-first-character', { ns: 'admin' })
        : t('attribute-invalid-identifier-first-character', { ns: 'admin' });
    case 'identifierLength':
      return type === ResourceType.ASSOCIATION
        ? t('association-invalid-identifier-length', { ns: 'admin' })
        : t('attribute-invalid-identifier-length', { ns: 'admin' });
    case 'unauthorized':
      return t('error-unauthenticated', { ns: 'admin' });
    default:
      return type === ResourceType.ASSOCIATION
        ? t('association-missing-general', { ns: 'admin' })
        : t('attribute-missing-general', { ns: 'admin' });
  }
}

export function translateDeleteModalTitle(
  type: 'model' | 'class' | 'association' | 'attribute',
  t: TFunction
) {
  switch (type) {
    case 'model':
      return t('delete-modal.model-title', { ns: 'admin' });
    case 'class':
      return t('delete-modal.class-title', { ns: 'admin' });
    case 'association':
      return t('delete-modal.association-title', { ns: 'admin' });
    case 'attribute':
      return t('delete-modal.attribute-title', { ns: 'admin' });
  }
}
export function translateDeleteModalDescription(
  type: 'model' | 'class' | 'association' | 'attribute',
  t: TFunction,
  targetName?: string
) {
  switch (type) {
    case 'model':
      return t('delete-modal.model-description', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'class':
      return t('delete-modal.class-description', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'association':
      return t('delete-modal.association-description', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'attribute':
      return t('delete-modal.attribute-description', {
        ns: 'admin',
        targetName: targetName,
      });
  }
}

export function translateDeleteModalSuccess(
  type: 'model' | 'class' | 'association' | 'attribute',
  t: TFunction,
  targetName?: string
) {
  switch (type) {
    case 'model':
      return t('delete-modal.model-success', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'class':
      return t('delete-modal.class-success', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'association':
      return t('delete-modal.association-success', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'attribute':
      return t('delete-modal.attribute-success', {
        ns: 'admin',
        targetName: targetName,
      });
  }
}

export function translateDeleteModalError(
  type: 'model' | 'class' | 'association' | 'attribute',
  t: TFunction,
  targetName?: string
) {
  switch (type) {
    case 'model':
      return t('delete-modal.model-error', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'class':
      return t('delete-modal.class-error', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'association':
      return t('delete-modal.association-error', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'attribute':
      return t('delete-modal.attribute-error', {
        ns: 'admin',
        targetName: targetName,
      });
  }
}

export function translateResourceCountTitle(
  type: ResourceType,
  t: TFunction,
  count?: number
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('association-count-title', { count: count ?? 0 });
    case ResourceType.ATTRIBUTE:
      return t('attribute-count-title', { count: count ?? 0 });
    default:
      return '';
  }
}

export function translateResourceAddition(type: ResourceType, t: TFunction) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('add-association', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return t('add-attribute', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateResourceName(type: ResourceType, t: TFunction) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('association-name', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return t('attribute-name', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateCreateNewResource(type: ResourceType, t: TFunction) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('create-new-association', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return t('create-new-attribute', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateCreateNewResourceForSelected(
  type: ResourceType,
  t: TFunction
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('create-new-sub-association-for-selected', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return t('create-new-sub-attribute-for-selected', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateDrawerButton(
  key: 'classes' | 'associations' | 'attributes',
  applicationProfile: boolean,
  t: TFunction
) {
  switch (key) {
    case 'classes':
      return applicationProfile ? t('class-restrictions') : t('classes');
    case 'associations':
      return applicationProfile
        ? t('association-restrictions')
        : t('associations');
    case 'attributes':
      return applicationProfile ? t('attribute-restrictions') : t('attributes');
    default:
      return '';
  }
}

export function translateDeleteReferenceModalDescription(
  type: ResourceType,
  name: string,
  t: TFunction
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return t('remove-reference-description-association', {
        ns: 'admin',
        name: name,
      });
    case ResourceType.ATTRIBUTE:
      return t('remove-reference-description-attribute', {
        ns: 'admin',
        name: name,
      });
    default:
      return '';
  }
}
