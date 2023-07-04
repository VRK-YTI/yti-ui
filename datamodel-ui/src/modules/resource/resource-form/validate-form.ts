import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';

interface CommonFormErrors {
  label: boolean;
  identifier: boolean;
  identifierInitChar: boolean;
  identifierLength: boolean;
  unauthorized?: boolean;
}

export default function validateForm(data: ResourceFormType): CommonFormErrors {
  const errors: CommonFormErrors = {
    label: true,
    identifier: true,
    identifierInitChar: true,
    identifierLength: true,
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

  return errors;
}
