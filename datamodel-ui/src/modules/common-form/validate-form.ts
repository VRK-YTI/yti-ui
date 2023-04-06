import { AssociationFormType } from '@app/common/interfaces/association-form.interface';
import { AttributeFormType } from '@app/common/interfaces/attribute-form.interface';

interface CommonFormErrors {
  label: boolean;
  identifier: boolean;
  unauthorized?: boolean;
}

export default function validateForm(
  data: AttributeFormType | AssociationFormType
): CommonFormErrors {
  const errors: CommonFormErrors = {
    label: true,
    identifier: true,
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

  return errors;
}
