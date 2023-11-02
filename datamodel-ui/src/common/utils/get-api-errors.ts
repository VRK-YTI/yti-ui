import { SerializedError } from '@reduxjs/toolkit';
import {
  AxiosBaseQueryError,
  AxiosQueryErrorFields,
  AxiosQuerySpringError,
} from 'yti-common-ui/interfaces/axios-base-query.interface';

export default function getApiError(
  error: AxiosBaseQueryError | SerializedError
): string[] {
  let errorStatus = '';
  let errorMessage = '';

  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null
  ) {
    if ('details' in error.data && error.data.details) {
      if (typeof error.data.details === 'string') {
        return [`Error: ${error.data.details}`];
      }
      return (error as AxiosQueryErrorFields).data.details.map(
        (detail) =>
          `VALIDATION ERROR: Field: ${detail.field.toUpperCase()} | Error: ${
            detail.message
          }`
      );
    }

    if ('detail' in error.data && typeof error.data.detail === 'string') {
      return [
        `${(error as AxiosQuerySpringError).data.title}: ${error.data.detail}`,
      ];
    }

    // defaults
    errorStatus = 'GENERAL_ERROR';
    errorMessage = 'Unexpected error occured';

    if ('status' in error.data && typeof error.data.status === 'string') {
      errorStatus = error.data.status ?? 'GENERAL_ERROR';
    } else if (
      'status' in error.data &&
      typeof error.data.status === 'number'
    ) {
      errorStatus = error.data.status.toString() ?? 'GENERAL_ERROR';
      errorStatus = `${errorStatus}`;
    }

    if ('message' in error.data && typeof error.data.message === 'string') {
      errorMessage = error.data.message ?? 'Unexpected error occured';
    } else if ('error' in error.data && typeof error.data.error === 'string') {
      errorMessage = error.data.error ?? 'Unexpected error occured';
      errorMessage = `${errorMessage}`;
    }

    return [`${errorStatus}: ${errorMessage}`];
  }

  return ['GENERAL_ERROR: Unexpected error occured'];
}
