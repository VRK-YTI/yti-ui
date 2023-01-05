import { ModelFormType } from '@app/common/interfaces/model-form.interface';

export interface FormErrors {
  languageAmount: boolean;
  titleAmount: boolean;
  prefix: boolean;
  serviceCategories: boolean;
  organizations: boolean;
}

export function validateForm(data: ModelFormType) {
  const errors = {
    languageAmount: false,
    titleAmount: false,
    prefix: false,
    serviceCategories: false,
    organizations: false,
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
    errors.titleAmount = true;
  }

  // Prefix should be defined
  if (!data.prefix || data.prefix.length < 1 || data.prefix === '') {
    errors.prefix = true;
  }

  // Should have at least one service category set
  if (data.serviceCategories.length < 1) {
    errors.serviceCategories = true;
  }

  // Should have at least one organization set
  if (data.organizations.length < 1) {
    errors.organizations = true;
  }

  return errors;
}
