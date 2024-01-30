import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';

export interface FormErrors {
  languageAmount: boolean;
  titleAmount: string[];
  prefix: boolean;
  serviceCategories: boolean;
  organizations?: boolean;
  fileData?: boolean;
  sourceSchema?: boolean;
  targetSchema?: boolean;
}

export function validateCrosswalkForm(data: CrosswalkFormType) {
  const errors: FormErrors = {
    languageAmount: false,
    titleAmount: [],
    prefix: false,
    serviceCategories: false,
    organizations: false,
    sourceSchema: false,
    targetSchema: false,
  };

  const selectedLanguages = data.languages.filter((lang) => lang.selected);

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

  // Source schema should be selected
  if (!data.sourceSchema || data.sourceSchema.length < 1) {
    errors.sourceSchema = true;
  }

  // Target schema should be selected
  if (!data.targetSchema || data.targetSchema.length < 1) {
    errors.targetSchema = true;
  }

  // Currently crosswalk is valif withou any organization also

  return errors;
}
