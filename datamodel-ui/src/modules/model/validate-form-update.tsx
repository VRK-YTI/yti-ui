import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import isEmail from 'validator/lib/isEmail';

export interface FormUpdateErrors {
  languageAmount: boolean;
  titleAmount: string[];
  serviceCategories: boolean;
  organizations: boolean;
  contact: boolean;
}

export function validateFormUpdate(data: ModelFormType) {
  const errors: FormUpdateErrors = {
    languageAmount: false,
    titleAmount: [],
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
