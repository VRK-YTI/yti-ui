import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

export interface FormUpdateErrors {
  languageAmount: boolean;
  titleAmount: string[];
  serviceCategories: boolean;
  organizations: boolean;
  contact: boolean;
  linksMissingInfo: boolean;
  linksInvalidUri: boolean;
}

export function validateFormUpdate(data: ModelFormType) {
  const errors: FormUpdateErrors = {
    languageAmount: false,
    titleAmount: [],
    serviceCategories: false,
    organizations: false,
    contact: false,
    linksMissingInfo: false,
    linksInvalidUri: false,
  };

  const selectedLanguages = data.languages.filter((lang) => lang.selected);

  // At least one language should be selected
  if (selectedLanguages.length < 1) {
    errors.languageAmount = true;
  }

  // All selected languages should have a title
  if (
    selectedLanguages.filter(
      (lang) => !lang.title || lang.title.trim().length < 1
    ).length > 0
  ) {
    const langsWithError = selectedLanguages
      .filter((lang) => !lang.title || lang.title.trim().length < 1)
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

  // If contact is set, it should be a valid email address
  if (data.contact && !isEmail(data.contact)) {
    errors.contact = true;
  }

  // Links should have name and uri defined
  if (
    data.links.length > 0 &&
    data.links.some(
      (link) =>
        !link.name ||
        Object.values(link.name).some((name) => name.trim().length === 0) ||
        !link.uri ||
        link.uri.trim() === ''
    )
  ) {
    errors.linksMissingInfo = true;
  }

  // Links uri should be a valid URL
  if (data.links.length > 0 && data.links.some((link) => !isURL(link.uri))) {
    errors.linksInvalidUri = true;
  }

  return errors;
}
