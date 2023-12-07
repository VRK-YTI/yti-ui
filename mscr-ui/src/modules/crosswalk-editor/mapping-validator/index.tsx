import { CrosswalkConnectionNew } from '@app/common/interfaces/crosswalk-connection.interface';

export default function validateMapping(input: CrosswalkConnectionNew) {
  const validationErrors: string[] = [];
  if (input.source.type === input.target.type) {
    // console.log('is valid');
  } else {
    validationErrors.push('Type mismatch');
  }
  return validationErrors;
}
