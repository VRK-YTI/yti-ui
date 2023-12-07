import {
  CrosswalkFormMockupType,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';

export interface FormErrors {
  name: boolean;
  description: boolean;
  sourceSchema: boolean;
  targetSchema: boolean;
}

export function validateForm(data: CrosswalkFormMockupType) {
  const errors: FormErrors = {
    name: false,
    description: false,
    sourceSchema: false,
    targetSchema: false,
  };

  // Source schema should be selected
  if (!data.sourceSchema || data.sourceSchema.length < 1) {
    errors.sourceSchema = true;
  }

  // Target schema should be selected
  if (!data.targetSchema || data.targetSchema.length < 1) {
    errors.targetSchema = true;
  }

  // Name should be set
  if (!data.label || data.label.length < 1) {
    errors.name = true;
  }

  // Description should be set
  if (!data.description || data.description.length < 1) {
    errors.description = true;
  }

  return errors;
}
