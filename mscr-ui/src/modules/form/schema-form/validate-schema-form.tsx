import { SchemaFormType } from '@app/common/interfaces/schema.interface';

// Not yet modified according to mscr validation errors
// Right now checks if selected languages have missing titles, or there is no file data
export interface FormErrors {
  languageAmount: boolean;
  titleAmount: string[];
  prefix: boolean;
  serviceCategories: boolean;
  fileData: boolean;
}

export function validateSchemaForm(
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
    (lang: { selected: boolean }) => lang.selected
  );

  // At least one language should be selected
  if (selectedLanguages.length < 1) {
    errors.languageAmount = true;
  }

  // All selected languages should have a title
  const titleless = selectedLanguages.filter(
    (lang: { title: string | undefined }) =>
      !lang.title || lang.title === '' || lang.title.length < 1
  );
  if (titleless.length > 0) {
    const langsWithError = titleless.map(
      (lang: { uniqueItemId: string }) => lang.uniqueItemId
    );

    errors.titleAmount = langsWithError ?? [];
  }

  if (!fileData) {
    errors.fileData = true;
  }

  return errors;
}
