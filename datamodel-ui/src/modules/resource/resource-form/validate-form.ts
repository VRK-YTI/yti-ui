import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';

export interface CommonFormErrors {
  label: boolean;
  identifier: boolean;
  identifierInitChar: boolean;
  identifierLength: boolean;
  identifierCharacters: boolean;
  maxCount: boolean;
  maxExclusive: boolean;
  maxInclusive: boolean;
  maxLength: boolean;
  minCount: boolean;
  minExclusive: boolean;
  minInclusive: boolean;
  minLength: boolean;
  unauthorized?: boolean;
}

export default function validateForm(data: ResourceFormType): CommonFormErrors {
  const errors: CommonFormErrors = {
    label: true,
    identifier: true,
    identifierInitChar: true,
    identifierLength: true,
    identifierCharacters: true,
    maxCount: true,
    maxExclusive: true,
    maxInclusive: true,
    maxLength: true,
    minCount: true,
    minExclusive: true,
    minInclusive: true,
    minLength: true,
  };

  if (
    data.label &&
    Object.keys(data.label).length > 0 &&
    Object.values(data.label).filter((val) => val && val.trim() !== '').length >
      0
  ) {
    errors.label = false;
  }

  if (data.identifier.trim() !== '') {
    errors.identifier = false;
  } else {
    return validateNumeric(data, {
      ...errors,
      identifierInitChar: false,
      identifierLength: false,
      identifierCharacters: false,
    });
  }

  if (/^[^[0-9]/.test(data.identifier)) {
    errors.identifierInitChar = false;
  }

  if (data.identifier.length > 1 && data.identifier.length < 33) {
    errors.identifierLength = false;
  }

  if (data.identifier.match(/^[a-zA-Z0-9\-_]+$/)) {
    errors.identifierCharacters = false;
  }

  return validateNumeric(data, errors);
}

function validateNumeric(
  data: ResourceFormType,
  errors: CommonFormErrors
): CommonFormErrors {
  const nanKeys = [
    'maxCount',
    'maxExclusive',
    'maxInclusive',
    'maxLength',
    'minCount',
    'minExclusive',
    'minInclusive',
    'minLength',
  ];

  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => {
      if (nanKeys.includes(key)) {
        const value = data[key as keyof ResourceFormType] as number | undefined;
        return [key, value && isNaN(value) ? true : false];
      }
      return [key, value];
    })
  ) as CommonFormErrors;
}
