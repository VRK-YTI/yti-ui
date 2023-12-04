import { ClassFormType } from '@app/common/interfaces/class-form.interface';

export interface ClassFormErrors {
  identifier: boolean;
  identifierInitChar: boolean;
  identifierLength: boolean;
  identifierCharacters: boolean;
  label: boolean;
  unauthorized?: boolean;
}

export function validateClassForm(data: ClassFormType): ClassFormErrors {
  const returnErrors: ClassFormErrors = {
    identifier: true,
    identifierInitChar: true,
    identifierLength: true,
    identifierCharacters: true,
    label: true,
  };

  if (
    Object.values(data.label).filter((value) => value.trim().length > 0)
      .length > 0
  ) {
    returnErrors.label = false;
  }

  if (data.identifier.trim() !== '') {
    returnErrors.identifier = false;
  } else {
    return {
      ...returnErrors,
      identifierInitChar: false,
      identifierLength: false,
      identifierCharacters: false,
    };
  }

  if (data.identifier.length > 1 && data.identifier.length < 33) {
    returnErrors.identifierLength = false;
  }

  if (/^[^0-9]/.test(data.identifier) || data.identifier.trim() === '') {
    returnErrors.identifierInitChar = false;
  }

  if (data.identifier.match(/^[a-zA-Z0-9\-_]+$/)) {
    returnErrors.identifierCharacters = false;
  }

  return returnErrors;
}
