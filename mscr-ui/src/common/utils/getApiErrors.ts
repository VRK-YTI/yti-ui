import { SerializedError } from '@reduxjs/toolkit';
import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';
import { MSCRError } from '../interfaces/error.interface';



export default function getApiError(
  error: AxiosBaseQueryError | SerializedError
): MSCRError {

  const mscrError: MSCRError = {};
  mscrError.status = '';
  mscrError.message = '';
  // console.log(error);

  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null
  ) {
    if ('status' in error.data && typeof error.data.status === 'string') {
      mscrError.status = error.data.status ?? 'GENERAL_ERROR';
      // console.log(error.data.status);
    } else if(('status' in error.data && typeof error.data.status === 'number') ) {
      mscrError.status = error.data.status.toString();
    }
    if ('message' in error.data && typeof error.data.message === 'string') {
      mscrError.message = error.data.message ?? 'Unexpected error occured';
    }
    if ('title' in error.data && typeof error.data.title === 'string') {
      mscrError.message = error.data.title ?? 'Unexpected error occured';
    }
    if ('detail' in error.data && typeof error.data.detail === 'string') {
      mscrError.detail = error.data.detail ?? 'Server Error';
    }
  }

  return mscrError;
}
