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
    case 'pronoun':
      return t('word-class.pronoun', { ns: 'common' });
    case 'noun':
      return t('word-class.noun', { ns: 'common' });
    case 'numeral':
      return t('word-class.numeral', { ns: 'common' });
    case 'verb':
      return t('word-class.verb', { ns: 'common' });
    default:
      return wordClass;
  }
}

export function translateEditConceptError(error: string, t: TFunction) {
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
    case 'source':
      return t('edit-concept-error.source', { ns: 'admin' });
    case 'diagrams':
      return t('edit-concept-error.diagrams', { ns: 'admin' });
    case 'status':
      return t('edit-concept-error.status', { ns: 'admin' });
    case 'prefLabel':
      return t('edit-concept-error.prefLabel', { ns: 'admin' });
    case 'termType':
      return t('edit-concept-error.termType', { ns: 'admin' });
    case 'language':
      return t('edit-concept-error.language', { ns: 'admin' });
    case 'recommendedTermDuplicate':
      return t('edit-concept-error.recommendedTermDuplicate', { ns: 'admin' });
    default:
      return t('edit-concept-error.default', { ns: 'admin' });
  }
}

export function translateFileUploadError(
  error: 'none' | 'upload-error' | 'incorrect-file-type',
  fileTypes: string[],
  t: TFunction
) {
  switch (error) {
    case 'upload-error':
      return t('file-upload-error.upload-error', { ns: 'admin' });
    case 'incorrect-file-type':
      return t('file-upload-error.incorrect-file-type', {
        ns: 'admin',
        count: fileTypes.length,
        fileTypes: fileTypes.join(', '),
      });
    default:
      return;
  }
}

export function translateHttpError(
  status: number | 'GENERIC_ERROR',
  t: TFunction
) {
  switch (status) {
    case 401:
      return t('error-occurred_session', { ns: 'alert' });
    case 500:
      return t('error-occurred_internal-server', { ns: 'alert' });
    default:
      return t('error-occured_unhandled-error', { ns: 'alert' });
  }
}

export function translateExcelParseError(message: string, t: TFunction) {
  switch (message) {
    case 'terminology-no-language':
      return t('concept-import.terminology-no-language', { ns: 'admin' });
    case 'term-missing-language-suffix':
      return t('concept-import.term-missing-language-suffix', { ns: 'admin' });
    case 'value-not-valid':
      return t('concept-import.value-not-valid', { ns: 'admin' });
    case 'property-missing-language-suffix':
      return t('concept-import.property-missing-language-suffix', {
        ns: 'admin',
      });
    case 'status-column-missing':
      return t('concept-import.status-column-missing', { ns: 'admin' });
    case 'prefLabel-column-missing':
      return t('concept-import.prefLabel-column-missing', { ns: 'admin' });
    case 'prefLabel-row-missing':
      return t('concept-import.prefLabel-row-missing', { ns: 'admin' });
    default:
      return t('concept-import.undefined-error', { ns: 'admin' });
  }
}

export function translateRemovalModalError(
  type: 'terminology' | 'concept' | 'collection',
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('error-occurred_remove-terminology', { ns: 'alert' });
    case 'concept':
      return t('error-occurred_remove-concept', { ns: 'alert' });
    case 'collection':
      return t('error-occurred_remove-collection', { ns: 'alert' });
    default:
      return t('error-occured', { ns: 'alert' });
  }
}

export function translateRemovalModalTitle(
  type: 'terminology' | 'concept' | 'collection',
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-title', { ns: 'admin' });
    case 'concept':
      return t('remove-modal.concept-title', { ns: 'admin' });
    case 'collection':
      return t('remove-modal.collection-title', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateRemovalModalConfirmation(
  type: 'terminology' | 'concept' | 'collection',
  targetName: string,
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-confirmation', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'concept':
      return t('remove-modal.concept-confirmation', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'collection':
      return t('remove-modal.collection-confirmation', {
        ns: 'admin',
        targetName: targetName,
      });
    default:
      return '';
  }
}

export function translateRemovalModalDescription(
  type: 'terminology' | 'concept' | 'collection',
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-description', { ns: 'admin' });
    case 'concept':
      return t('remove-modal.concept-description', { ns: 'admin' });
    case 'collection':
      return t('remove-modal.collection-description', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateRemovalModalProcessing(
  type: 'terminology' | 'concept' | 'collection',
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-processing', { ns: 'admin' });
    case 'concept':
      return t('remove-modal.concept-processing', { ns: 'admin' });
    case 'collection':
      return t('remove-modal.collection-processing', { ns: 'admin' });
    default:
      return '';
  }
}

export function translateRemovalModalRemoved(
  type: 'terminology' | 'concept' | 'collection',
  targetName: string,
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-removed', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'concept':
      return t('remove-modal.concept-removed', {
        ns: 'admin',
        targetName: targetName,
      });
    case 'collection':
      return t('remove-modal.collection-removed', {
        ns: 'admin',
        targetName: targetName,
      });
    default:
      return '';
  }
}

export function translateRemovalModalWarning(
  type: 'terminology' | 'concept' | 'collection',
  t: TFunction
) {
  switch (type) {
    case 'terminology':
      return t('remove-modal.terminology-warning', {
        ns: 'admin',
      });
    case 'concept':
      return t('remove-modal.concept-warning', {
        ns: 'admin',
      });
    case 'collection':
      return t('remove-modal.collection-warning', {
        ns: 'admin',
      });
    default:
      return '';
  }
}
