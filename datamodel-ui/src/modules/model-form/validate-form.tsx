import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import isEmail from 'validator/lib/isEmail';

export interface FormErrors {
  languageAmount: boolean;
  titleAmount: string[];
  prefix: boolean;
  prefixInitChar: boolean;
  prefixLength: boolean;
  serviceCategories: boolean;
  organizations: boolean;
  contact: boolean;
}

export function validateForm(data: ModelFormType) {
  const errors: FormErrors = {
    languageAmount: false,
    titleAmount: [],
    prefix: false,
    prefixInitChar: false,
    prefixLength: false,
    serviceCategories: false,
    organizations: false,
    contact: false,
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

  // Prefix should be defined
  if (!data.prefix || data.prefix.length < 1 || data.prefix === '') {
    errors.prefix = true;
  }

  // Prefix should not start with a digit
  if (data.prefix && data.prefix !== '' && /^[0-9]/.test(data.prefix)) {
    errors.prefixInitChar = true;
  }

  // Prefix length should be between 2-32 characters
  if (
    data.prefix &&
    data.prefix !== '' &&
    (data.prefix.length < 2 || data.prefix.length > 32)
  ) {
    errors.prefixLength = true;
  }

  // Should have at least one service category set
  if (data.serviceCategories.length < 1) {
    errors.serviceCategories = true;
  }

  // Should have at least one organization set
  if (data.organizations.length < 1) {
    errors.organizations = true;
  }

  if (data.contact && !isEmail(data.contact)) {
    errors.contact = true;
  }

  return errors;
}
