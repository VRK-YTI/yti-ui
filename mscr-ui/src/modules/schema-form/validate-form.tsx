import { SchemaFormType } from '@app/common/interfaces/schema.interface';

// Not yet modified according to mscr validation errors
export interface FormErrors {
  languageAmount: boolean;
  titleAmount: string[];
  prefix: boolean;
  serviceCategories: boolean;
  fileData: boolean;
}

export function validateForm(
  data: SchemaFormType,
  fileData: File | null | undefined
) {
  // console.log(FormData);
  const errors: FormErrors = {
    languageAmount: false,
    titleAmount: [],
    prefix: false,
    serviceCategories: false,
    fileData: false,
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

  if (!fileData) {
    errors.fileData = true;
  }

  return errors;
}
