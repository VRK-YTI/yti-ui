import { FormType } from '@app/common/utils/hooks/use-initial-form';
import { Type } from '@app/common/interfaces/search.interface';
import { ModalType } from '@app/modules/form/index';
import {
  Format,
  formatsAvailableForCrosswalkRegistration,
  formatsAvailableForSchemaRegistration,
} from '@app/common/interfaces/format.interface';

export interface InputErrors {
  languageAmount: boolean;
  titleAmount: string[];
  sourceSchema: boolean;
  targetSchema: boolean;
  fileData: boolean;
  format: boolean;
}

export function validateForm(
  formData: FormType,
  contentType: Type,
  modalType: ModalType,
  fileData: File | null | undefined,
  fileUri: string | null | undefined
) {
  const errors: InputErrors = {
    languageAmount: false,
    titleAmount: [],
    sourceSchema: false,
    targetSchema: false,
    fileData: false,
    format: false,
  };

  const selectedLanguages = formData.languages.filter((lang) => lang.selected);

  // At least one language should be selected
  if (selectedLanguages.length < 1) {
    errors.languageAmount = true;
  }

  // All selected languages should have a title
  if (
    selectedLanguages.filter(
      (lang) => !lang.title || lang.title === '' || lang.title.length < 1
    ).length > 0
  ) {
    const langsWithError = selectedLanguages
      .filter(
        (lang) => !lang.title || lang.title === '' || lang.title.length < 1
      )
      .map((lang) => lang.uniqueItemId);

    errors.titleAmount = langsWithError ?? [];
  }

  // Crosswalk specific:
  if (contentType == Type.Crosswalk) {
    // Source schema should be selected
    if (!formData.sourceSchema || formData.sourceSchema.length < 1) {
      errors.sourceSchema = true;
    }

    // Target schema should be selected
    if (!formData.targetSchema || formData.targetSchema.length < 1) {
      errors.targetSchema = true;
    }
  }

  // When registering existing schema or crosswalk or versioning content with file
  if (
    modalType == ModalType.RegisterNewFull ||
    modalType == ModalType.RevisionFull
  ) {
    // File should be provided
    if (!fileData && (!fileUri || fileUri == '')) {
      errors.fileData = true;
    }
    // Format should be provided
    if (!formData.format) {
      errors.format = true;
    }
    // Crosswalk format should be acceptable
    if (
      contentType == Type.Crosswalk &&
      !formatsAvailableForCrosswalkRegistration.includes(formData.format)
    ) {
      errors.format = true;
    }
    // Schema format should be acceptable
    if (
      contentType == Type.Schema &&
      !formatsAvailableForSchemaRegistration.includes(formData.format)
    ) {
      errors.format = true;
    }
    // Todo: Check format against file format

    // If not registering with a file, format should be MSCR
  } else if (formData.format !== Format.Mscr) {
    errors.format = true;
  }

  return errors;
}
