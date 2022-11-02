import { AxiosBaseQueryError } from '@app/store/axios-base-query';
import { SerializedError } from '@reduxjs/toolkit';

export interface ExcelError {
  code: string;
  data: ExcelErrorDetails;
}

export interface ExcelErrorDetails {
  message: string;
  errorDetails?: {
    sheet: string;
    row: number;
    column: string;
  };
}

export const createErrorMessage = (
  error: AxiosBaseQueryError | SerializedError | undefined
) => {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      data: { message: 'Unknown error' },
    } as ExcelError;
  }

  // AxiosBaseQueryError
  if ('status' in error) {
    return {
      code: error.status,
      data: error.data as ExcelErrorDetails,
    } as ExcelError;
  }
  // SerializedError
  if ('code' in error) {
    return {
      code: error.code ?? 'UNKNOWN_ERROR',
      data: {
        message:
          error.message ?? error.code
            ? `Error code ${error.code}`
            : 'Unknown error',
      },
    } as ExcelError;
  }
};
