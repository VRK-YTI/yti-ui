import { SchemaFormType } from '@app/common/interfaces/schema.interface';

// Not yet modified according to mscr validation errors
export interface FormErrors {
  languageAmount: boolean;
  titleAmount: string[];
  prefix: boolean;
  serviceCategories: boolean;
  organizations: boolean;
}

export function validateForm(data: SchemaFormType) {
  const errors: FormErrors = {
    languageAmount: false,
    titleAmount: [],
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
    const langsWithError = selectedLanguages
      .filter(
        (lang) => !lang.title || lang.title === '' || lang.title.length < 1
      )
      .map((lang) => lang.uniqueItemId);

    errors.titleAmount = langsWithError ?? [];
  }

  // Should have at least one organization set
  if (data.organizations.length < 1) {
    errors.organizations = true;
  }

  return errors;
}
