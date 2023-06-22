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
      return (error as AxiosQueryErrorFields).data.details.map(
        (detail) => `VALIDATION ERROR: ${detail.field} - ${detail.message}`
      );
    }

    if ('detail' in error.data && typeof error.data.detail === 'string') {
      return [
        `${(error as AxiosQuerySpringError).data.title}: ${error.data.detail}`,
      ];
    }

    if ('status' in error.data && typeof error.data.status === 'string') {
      errorStatus = error.data.status ?? 'GENERAL_ERROR';
    }
    if ('message' in error.data && typeof error.data.message === 'string') {
      errorMessage = error.data.message ?? 'Unexpected error occured';
    }

    return [`${errorStatus}: ${errorMessage}`];
  }

  return ['GENERAL_ERROR: Unexpected error occured'];
}
