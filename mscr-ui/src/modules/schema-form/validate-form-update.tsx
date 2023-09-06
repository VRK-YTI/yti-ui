import { SchemaFormType } from '@app/common/interfaces/schema.interface';
import isEmail from 'validator/lib/isEmail';

export interface FormUpdateErrors {
  languageAmount: boolean;
  titleAmount: string[];
  serviceCategories: boolean;
  organizations: boolean;
  contact: boolean;
}

export function validateFormUpdate(data: SchemaFormType) {
  const errors: FormUpdateErrors = {
    languageAmount: false,
    titleAmount: [],
    serviceCategories: false,
    organizations: false,
    contact: false,
  };

  const selectedLanguages = data.languages.filter(
    (lang: { selected: any }) => lang.selected
  );

  // At least one language should be selected
  if (selectedLanguages.length < 1) {
    errors.languageAmount = true;
  }

  // All selected languages should have a title
  if (
    selectedLanguages.filter(
      (lang: { title: string | any[] }) =>
        !lang.title || lang.title === '' || lang.title.length < 1
    ).length > 0
  ) {
    const langsWithError = selectedLanguages
      .filter(
        (lang: { title: string | any[] }) =>
          !lang.title || lang.title === '' || lang.title.length < 1
      )
      .map((lang: { uniqueItemId: any }) => lang.uniqueItemId);

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

  return errors;
}
