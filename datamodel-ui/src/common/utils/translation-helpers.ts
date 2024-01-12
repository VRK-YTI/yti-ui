import { TFunction } from 'next-i18next';
import { ResourceType } from '../interfaces/resource-type.interface';
import { Type } from '../interfaces/type.interface';
import { NotificationKeys } from '../interfaces/notifications.interface';

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

export function translateResourceType(
  type: ResourceType | string,
  t: TFunction
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
    case 'association':
      return t('association');
    case ResourceType.ATTRIBUTE:
    case 'attribute':
      return t('attribute');
    default:
      return t('class', { ns: 'common' });
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
    case 'linksMissingInfo':
      return t('missing-link-information', { ns: 'admin' });
    case 'linksInvalidUri':
      return t('link-uri-is-invalid', { ns: 'admin' });
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
    case 'identifierCharacters':
      return t('class-invalid-identifier-characters', { ns: 'admin' });
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
    case 'functional':
      return type === ResourceType.ASSOCIATION
        ? t('common-view.associations-functional', { ns: 'common' })
        : t('common-view.attributes-functional', { ns: 'common' });
    case 'transitive':
      return t('common-view.transitive', { ns: 'common' });
    case 'reflexive':
      return t('common-view.reflexive', { ns: 'common' });
    default:
      return '';
  }
}

export function translateCommonTooltips(
  tooltip: string,
  type: ResourceType,
  t: TFunction
) {
  switch (tooltip) {
    case 'identifier':
      return type === ResourceType.ASSOCIATION
        ? t('tooltip.associations-identifier', { ns: 'common' })
        : t('tooltip.attributes-identifier', { ns: 'common' });
    case 'upper':
      return type === ResourceType.ASSOCIATION
        ? t('tooltip.upper-associations', { ns: 'common' })
        : t('tooltip.upper-attributes', { ns: 'common' });
    case 'equivalent':
      return type === ResourceType.ASSOCIATION
        ? t('tooltip.equivalent-associations', { ns: 'common' })
        : t('tooltip.equivalent-attributes', { ns: 'common' });
    case 'functional':
      return type === ResourceType.ASSOCIATION
        ? t('tooltip.associations-functional', { ns: 'common' })
        : t('tooltip.attributes-functional', { ns: 'common' });
    case 'transitive':
      return t('tooltip.transitive', { ns: 'common' });
    case 'reflexive':
      return t('tooltip.reflexive', { ns: 'common' });
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
    case 'identifierCharacters':
      return type === ResourceType.ASSOCIATION
        ? t('association-invalid-identifier-characters', { ns: 'admin' })
        : t('attribute-invalid-identifier-characters', { ns: 'admin' });
    case 'unauthorized':
      return t('error-unauthenticated', { ns: 'admin' });
    case 'nonNumeric':
      return t('error-non-numeric-values', { ns: 'admin' });
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

export function translateDeleteModalSpinner(
  type: 'model' | 'class' | 'association' | 'attribute',
  t: TFunction
) {
  switch (type) {
    case 'model':
      return t('delete-modal.deleting-model', { ns: 'admin' });
    case 'class':
      return t('delete-modal.deleting-class', { ns: 'admin' });
    case 'association':
      return t('delete-modal.deleting-association', { ns: 'admin' });
    case 'attribute':
      return t('delete-modal.deleting-attribute', { ns: 'admin' });
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

export function translateResourceAddition(
  type: ResourceType,
  t: TFunction,
  applicationProfile?: boolean
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return applicationProfile
        ? t('add-association-restriction', { ns: 'admin' })
        : t('add-association', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return applicationProfile
        ? t('add-attribute-restriction', { ns: 'admin' })
        : t('add-attribute', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateResourceName(
  type: ResourceType,
  t: TFunction,
  applicationProfile?: boolean
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return applicationProfile
        ? t('association-restriction-name', { ns: 'admin' })
        : t('association-name', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return applicationProfile
        ? t('attribute-restriction-name', { ns: 'admin' })
        : t('attribute-name', { ns: 'admin' });
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
        : t('associations', { ns: 'common' });
    case 'attributes':
      return applicationProfile
        ? t('attribute-restrictions')
        : t('attributes', { ns: 'common' });
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

export function translateApplicationProfileTopDescription(
  type: ResourceType,
  t: TFunction,
  external?: boolean
) {
  switch (type) {
    case ResourceType.ASSOCIATION:
      return external
        ? t('association-constraint-toggle-description-external', {
            ns: 'admin',
          })
        : t('association-constraint-toggle-description', { ns: 'admin' });
    case ResourceType.ATTRIBUTE:
      return external
        ? t('attribute-constraint-toggle-description-external', {
            ns: 'admin',
          })
        : t('attribute-constraint-toggle-description', { ns: 'admin' });
  }
}

export function translateNotification(
  key: NotificationKeys,
  applicationProfile: boolean,
  t: TFunction
) {
  switch (key) {
    case 'MODEL_ADD':
      return applicationProfile
        ? t('profile-added', { ns: 'admin' })
        : t('library-added', { ns: 'admin' });
    case 'MODEL_EDIT':
      return applicationProfile
        ? t('profile-edited', { ns: 'admin' })
        : t('library-edited', { ns: 'admin' });
    case 'ASSOCIATION_ADD':
      return applicationProfile
        ? t('association-restriction-added', { ns: 'admin' })
        : t('association-added', { ns: 'admin' });
    case 'ASSOCIATION_EDIT':
      return applicationProfile
        ? t('association-restriction-edited', { ns: 'admin' })
        : t('association-edited', { ns: 'admin' });
    case 'ATTRIBUTE_ADD':
      return applicationProfile
        ? t('attribute-restriction-added', { ns: 'admin' })
        : t('attribute-added', { ns: 'admin' });
    case 'ATTRIBUTE_EDIT':
      return applicationProfile
        ? t('attribute-restriction-edited', { ns: 'admin' })
        : t('attribute-edited', { ns: 'admin' });
    case 'CLASS_ADD':
      return applicationProfile
        ? t('class-restriction-added', { ns: 'admin' })
        : t('class-added', { ns: 'admin' });
    case 'CLASS_EDIT':
      return applicationProfile
        ? t('class-restriction-edited', { ns: 'admin' })
        : t('class-edited', { ns: 'admin' });
    case 'DOCUMENTATION_EDIT':
      return t('documentation-edited', { ns: 'admin' });
    case 'LINK_EDIT':
      return t('link-edited', { ns: 'admin' });
    case 'POSITION_SAVE':
      return t('position-saved', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateTooltip(key: string, t: TFunction) {
  switch (key) {
    case 'graph-tools_zoom-in':
      return t('graph-tools.zoom-in', { ns: 'common' });
    case 'graph-tools_zoom-out':
      return t('graph-tools.zoom-out', { ns: 'common' });
    case 'graph-tools_fullscreen':
      return t('graph-tools.fullscreen', { ns: 'common' });
    case 'graph-tools_reset-positions':
      return t('graph-tools.reset-positions', { ns: 'common' });
    case 'graph-tools_zoom-to':
      return t('graph-tools.zoom-to', { ns: 'common' });
    case 'graph-tools_save-positions':
      return t('graph-tools.save-positions', { ns: 'common' });
    case 'graph-tools_download-picture':
      return t('graph-tools.download-picture', { ns: 'common' });
    default:
      return '';
  }
}

export function translatePageTitle(
  key: string,
  type: ResourceType,
  t: TFunction,
  applicationProfile?: boolean
) {
  switch (key) {
    case 'return-to-list':
      switch (type) {
        case 'CLASS':
          return t('return-to-class-list', { ns: 'common' });
        case 'ASSOCIATION':
          return t('return-to-association-list', { ns: 'common' });
        case 'ATTRIBUTE':
          return t('return-to-attribute-list', { ns: 'common' });
        default:
          return '';
      }
    case 'return-to-resource':
      switch (type) {
        case 'CLASS':
          return applicationProfile
            ? t('return-to-class-restriction', { ns: 'admin' })
            : t('return-to-class', { ns: 'admin' });
        case 'ASSOCIATION':
          return applicationProfile
            ? t('return-to-association-restriction', { ns: 'admin' })
            : t('return-to-association', { ns: 'admin' });
        case 'ATTRIBUTE':
          return applicationProfile
            ? t('return-to-attribute-restriction', { ns: 'admin' })
            : t('return-to-attribute', { ns: 'admin' });
        default:
          return '';
      }
    case 'edit':
      switch (type) {
        case 'CLASS':
          return applicationProfile
            ? t('edit-class-restriction', { ns: 'admin' })
            : t('edit-class', { ns: 'admin' });
        case 'ASSOCIATION':
          return applicationProfile
            ? t('edit-association-restriction', { ns: 'admin' })
            : t('edit-association', { ns: 'admin' });
        case 'ATTRIBUTE':
          return applicationProfile
            ? t('edit-attribute-restriction', { ns: 'admin' })
            : t('edit-attribute', { ns: 'admin' });
        default:
          return '';
      }
    case 'create':
      switch (type) {
        case 'CLASS':
          return applicationProfile
            ? t('create-class-restriction', { ns: 'admin' })
            : t('create-class', { ns: 'admin' });
        case 'ASSOCIATION':
          return applicationProfile
            ? t('create-association-restriction', { ns: 'admin' })
            : t('create-association', { ns: 'admin' });
        case 'ATTRIBUTE':
          return applicationProfile
            ? t('create-attribute-restriction', { ns: 'admin' })
            : t('create-attribute', { ns: 'admin' });
        default:
          return '';
      }
    case 'create-sub':
      switch (type) {
        case 'CLASS':
          return t('create-subclass', { ns: 'admin' });
        case 'ASSOCIATION':
          return t('create-sub-assocation', { ns: 'admin' });
        case 'ATTRIBUTE':
          return t('create-sub-attribute', { ns: 'admin' });
        default:
          return '';
      }
    default:
      return '';
  }
}

export function translateLinkPlaceholder(key: string, t: TFunction) {
  switch (key) {
    case 'link':
      return t('link-title-placeholder', { ns: 'admin' });
    case 'image':
      return t('image-title-placeholder', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateDocumentationTooltip(key: string, t: TFunction) {
  switch (key) {
    case 'bold-button':
      return t('bold-button-tooltip', { ns: 'admin' });
    case 'italic-button':
      return t('italic-button-tooltip', { ns: 'admin' });
    case 'quote-button':
      return t('quote-button-tooltip', { ns: 'admin' });
    case 'list-bulleted-button':
      return t('list-bulleted-button-tooltip', { ns: 'admin' });
    case 'list-numbered-button':
      return t('list-numbered-button-tooltip', { ns: 'admin' });
    case 'link-button':
      return t('link-button-tooltip', { ns: 'admin' });
    case 'image-button':
      return t('image-button-tooltip', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateResultType(key: string, t: TFunction) {
  switch (key) {
    case 'class':
      return t('classes', { ns: 'common' });
    case 'attribute':
      return t('attributes', { ns: 'common' });
    case 'association':
      return t('associations', { ns: 'common' });
    default:
      return '';
  }
}
