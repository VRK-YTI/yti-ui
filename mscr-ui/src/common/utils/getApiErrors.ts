import { SerializedError } from '@reduxjs/toolkit';
import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';

export default function getApiError(
  error: AxiosBaseQueryError | SerializedError
): string {
  let errorStatus = '';
  let errorMessage = '';

  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null
  ) {
    if ('status' in error.data && typeof error.data.status === 'string') {
      errorStatus = error.data.status ?? 'GENERAL_ERROR';
    }
    if ('message' in error.data && typeof error.data.message === 'string') {
      errorMessage = error.data.message ?? 'Unexpected error occured';
    }
  } else {
    errorStatus = 'GENERAL_ERROR';
    errorMessage = 'Unexpected error occured';
  }

  return `${errorStatus}: ${errorMessage}`;
}
