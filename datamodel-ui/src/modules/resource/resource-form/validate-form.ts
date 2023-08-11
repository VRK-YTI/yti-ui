import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';

export interface CommonFormErrors {
  label: boolean;
  identifier: boolean;
  identifierInitChar: boolean;
  identifierLength: boolean;
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
    Object.values(data.label).filter((val) => val && val !== '').length > 0
  ) {
    errors.label = false;
  }

  if (data.identifier && data.identifier !== '') {
    errors.identifier = false;
  }

  if (data.identifier && /^[^[0-9]/.test(data.identifier)) {
    errors.identifierInitChar = false;
  }

  if (
    data.identifier &&
    data.identifier.length > 1 &&
    data.identifier.length < 33
  ) {
    errors.identifierLength = false;
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
